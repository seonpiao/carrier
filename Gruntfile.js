  /*global module:false*/
var fs = require('fs');
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    stylus: {
      'dist/css/**.css': ['static/stylus/**/main.styl']
    },

    cssmin: {
      compress: {
        // files: {
        //   'dist/css/**.min.css': ['dist/css/**.css']
        // }
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: '*.css',
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'static/libs/**/*.js',
          'static/common/**/*.js'
        ],
        tasks: ['requirejs:std', 'stylus', 'jade']
      },
      stylesheets: {
        files: [
          'static/stylus/**/*.styl',
          'static/modules/**/*.styl'
        ],
        tasks: ['stylus']
      },
      css: {
        files: [
          'static/css/*.css'
        ],
        tasks: ['requirejs:std', 'stylus', 'jade']
      },
      jade: {
        files: [
          'static/modules/**/*.jade',
          'static/views/*.jade',
          'static/views/**/*.jade'
        ],
        // tasks: ['jade']
        tasks: ['jade']
      }
    },
    jade: {
      site: {
        files: {
          'dist/template/': ['static/modules/**/*.jade']
        }
      },
      options: {
        basePath: 'static'
      }
    },
    uglify: {
      site: {
        files: {
          'dist/js/**/main.min.js': ['dist/js/**/main.js']
        }
      }
    },
    requirejs: {
      std: {
        options: {
          baseUrl: "./static",
          mainConfigFile: 'static/config.js',
          dir: 'dist/',
          optimize: 'none',
          keepBuildDir: false,
          paths: {
            "jquery": "libs/jquery-1.11.1",
            "jquery-cookie": "libs/jquery-cookie",
            "underscore": "libs/underscore",
            "backbone": "libs/backbone",
            "oz": "libs/oz",
            "jaderuntime": "libs/runtime"
          },
          modules: [{
            name: 'js/common/main'
          }, {
            name: 'js/index/main'
          }, {
            name: 'js/page1/main'
          }, {
            name: 'js/page404/main'
          }, {
            name: 'js/app/main'
          }]
        }
      }
    },
    genstatic: {
      options: {
        copy: ['image', 'fonts', 'externals']
      }
    },
    filerev: {
      options: {
        algorithm: 'sha1',
        length: 16
      },
      js: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: 'js/**/*.js',
          dest: 'dist'
        }],
      },
      // 加载 MD5后的文件名，将映射关系保存在 tpl-ver.js 文件中，每次 build 重写
      // view/base.js@loadTemplate 根据tpl-ver.js 取出 MD5后的文件名
      tpl: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: 'template/**/*.js',
          dest: 'dist'
        }],
      },
      'tpl-ver': {
        src: 'dist/template/tpl-ver.js',
        dest: 'dist/template',
      },
      css: {
        src: 'dist/css/*.css',
        dest: 'dist/css'
      }
    },
    'string-replace': {
      src: {
        files: [{
          expand: true,
          cwd: 'views',
          src: ['**/*.jade', '*.html'],
          dest: 'views'
        }],
        options: {
          replacements: [{
            pattern: /\/dist\/(.*\.(js|css))/gm,
            replacement: function(match) {
              var file = match.replace(/(.*\.)\w{16}\.(js|css)/, '$1$2');
              ori = file.replace('/dist', 'dist');
              console.log(file);
              // console.log(grunt.filerev.summary);
              return grunt.filerev.summary[ori].replace(/^dist/g, '/dist');
            }
          }]
        }
      }
    },
    newapp: {
      options: {
        dest: ''
      }
    },
    newpage: {
      options: {
        dest: ''
      }
    },
    newmodule: {
      options: {
        modulePath: 'modules',
        jsPrefix: 'modules/',
        stylPrefix: '../../../modules/'
      }
    },
    addmodule: {
      options: {
        modulePath: 'modules',
        jsPrefix: 'modules/',
        stylPrefix: '../../../modules/',
        path: ''
      }
    },
    rmmodule: {
      options: {
        modulePath: 'modules',
        path: ''
      }
    }
  });
  // require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('private-grunt-contrib-uglify-wly');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('private-grunt-contrib-stylus');
  // grunt.loadNpmTasks('private-grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('private-grunt-jade-runtime');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-carrier-helper');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('tpl-ver', function() {
    var summary = grunt.filerev.summary;
    var map = {};
    for (var key in summary) {
      if (key.indexOf('dist/template/modules') == 0) {
        var file = key.replace('dist/template/modules/', '').replace('.js', '');
        var md5File = summary[key].replace('dist/template/modules/', '')
        map[file] = md5File;
      }
    }
    var str = 'var tplMapping = ' + JSON.stringify(map);
    fs.writeFileSync('dist/template/tpl-ver.js', str);
  });

  grunt.registerTask('md5', ['filerev', 'tpl-ver', 'string-replace']);

  grunt.registerTask('build', ['requirejs', 'genstatic', 'stylus', 'cssmin', 'uglify', 'jade', 'filerev:tpl', 'tpl-ver',
    'filerev:tpl-ver', 'filerev:js', 'filerev:css', 'string-replace'
  ]);
};