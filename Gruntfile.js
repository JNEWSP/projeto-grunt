module.exports = function(grunt) {
  
  // Carregar todas as tarefas do package.json
  require('load-grunt-tasks')(grunt);
  
  // Configuração do projeto
  grunt.initConfig({
    
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    
    // Configurações de caminhos
    paths: {
      src: 'src',
      dist: 'dist',
      build: 'build'
    },
    
    // Limpar diretórios
    clean: {
      dist: ['<%= paths.dist %>/*'],
      build: ['<%= paths.build %>/*']
    },
    
    // Copiar arquivos
    copy: {
      html: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['*.html'],
          dest: '<%= paths.dist %>'
        }]
      },
      assets: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['img/**', 'fonts/**'],
          dest: '<%= paths.dist %>'
        }]
      }
    },
    
    // Compilar LESS
    less: {
      development: {
        options: {
          paths: ['<%= paths.src %>/less'],
          sourceMap: true,
          sourceMapFilename: '<%= paths.dist %>/css/main.css.map',
          sourceMapURL: 'main.css.map'
        },
        files: {
          '<%= paths.dist %>/css/main.css': '<%= paths.src %>/less/main.less'
        }
      },
      production: {
        options: {
          paths: ['<%= paths.src %>/less'],
          compress: true,
          cleancss: true
        },
        files: {
          '<%= paths.build %>/css/main.min.css': '<%= paths.src %>/less/main.less'
        }
      }
    },
    
    // Minificar CSS
    cssmin: {
      target: {
        files: {
          '<%= paths.build %>/css/main.min.css': ['<%= paths.dist %>/css/main.css']
        }
      }
    },
    
    // Minificar JavaScript
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        compress: {
          drop_console: true
        }
      },
      development: {
        files: {
          '<%= paths.dist %>/js/app.min.js': [
            '<%= paths.src %>/js/color-generator.js',
            '<%= paths.src %>/js/app.js'
          ]
        }
      },
      production: {
        files: {
          '<%= paths.build %>/js/app.min.js': [
            '<%= paths.src %>/js/color-generator.js',
            '<%= paths.src %>/js/app.js'
          ]
        }
      }
    },
    
    // Minificar HTML - CORRIGIDO
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: ['*.html'],
          dest: '<%= paths.dist %>'
        }]
      },
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: {
          '<%= paths.build %>/index.html': '<%= paths.dist %>/index.html'
        }
      }
    },
    
    // Substituir variáveis no HTML
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'BUILD_DATE',
              replacement: '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>'
            },
            {
              match: 'VERSION',
              replacement: '<%= pkg.version %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= paths.dist %>/*.html'],
            dest: '<%= paths.dist %>/'
          }
        ]
      },
      build: {
        options: {
          patterns: [
            {
              match: 'BUILD_DATE',
              replacement: '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>'
            },
            {
              match: 'VERSION',
              replacement: '<%= pkg.version %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= paths.build %>/*.html'],
            dest: '<%= paths.build %>/'
          }
        ]
      }
    },
    
    // Observar arquivos para mudanças - CORRIGIDO
    watch: {
      less: {
        files: ['<%= paths.src %>/less/**/*.less'],
        tasks: ['less:development']
      },
      js: {
        files: ['<%= paths.src %>/js/**/*.js'],
        tasks: ['uglify:development']
      },
      html: {
        files: ['<%= paths.src %>/*.html'],
        tasks: ['htmlmin:dist', 'replace:dist']  // Agora minifica diretamente de src para dist
      }
    },
    
    // Executar tarefas em paralelo
    concurrent: {
      dev: {
        tasks: ['watch:less', 'watch:js', 'watch:html'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
    
  });
  
  // Tarefa padrão para desenvolvimento - CORRIGIDO
  grunt.registerTask('default', [
    'clean:dist',
    'less:development',
    'uglify:development',
    'htmlmin:dist',
    'replace:dist'
  ]);
  
  // Tarefa para desenvolvimento com watch
  grunt.registerTask('dev', [
    'default',
    'concurrent:dev'
  ]);
  
  // Tarefa para produção - CORRIGIDO
  grunt.registerTask('build', [
    'clean:build',
    'less:production',
    'uglify:production',
    'htmlmin:build',
    'replace:build'
  ]);
  
  // Tarefa alternativa que inclui cópia de assets
  grunt.registerTask('dev-with-assets', [
    'clean:dist',
    'copy:assets',
    'less:development',
    'uglify:development',
    'htmlmin:dist',
    'replace:dist'
  ]);
  
  // Tarefa personalizada divertida: gerar cor aleatória
  grunt.registerTask('randomColor', 'Gera uma cor hexadecimal aleatória', function() {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    grunt.log.writeln('Cor gerada: ' + color);
    grunt.log.writeln('Cor em RGB: rgb(' + 
      parseInt(color.substr(1, 2), 16) + ', ' +
      parseInt(color.substr(3, 2), 16) + ', ' +
      parseInt(color.substr(5, 2), 16) + ')');
  });
  
};