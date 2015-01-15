module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			dist: {
				files: {
					'dist/js/scripts.min.js': ['app/scripts/plugins.js', 'app/scripts/templates.js', 'app/scripts/main.js']
				}
			}
		},
		less: {
			dev: {
				files: {
					'app/css/style.css': 'app/less/style.less'
				}
			},
			dist: {
				options: {
					yuicompress: true
				},
				files: {
					'dist/css/style.min.css': ['app/less/style.less', 'app/less/responsive.less']
				}
			}
		},
		handlebars: {
			compile: {
				options: {
					namespace: 'NVVE.Templates',
					processName: function(filename) {
						var nameArray = filename.split('/');
						return nameArray[nameArray.length-1];
					}
				},
				files: {
					'app/scripts/templates.js': ['app/templates/persoonsgegevens', 'app/templates/contactgegevens', 'app/templates/betaalgegevens']
				}
			}
		},
		watch: {
			less: {
				files: ['app/less/*'],
				tasks: 'less'
			},
			uglify: {
				files: ['app/scripts/*'],
				tasks: 'uglify'
			}
		},
		copy: {
			dist: {
				files: [
					{expand: true, cwd: 'app/scripts/vendor', src: ['*'], dest: 'dist/scripts/vendor/'},
					{expand: true, cwd: 'app/img/', src: ['*'], dest: 'dist/img/'},
					{expand: true, cwd: 'app/video/', src: ['*'], dest: 'dist/video/'},
					{expand: true, cwd: 'app/fonts/', src: ['*'], dest: 'dist/fonts/'},
					{expand: true, cwd: 'app/', src: ['register.php'], dest: 'dist/', filter: 'isFile'},
					{expand: true, cwd: 'app/', src: ['dummy.html'], dest: 'dist/', filter: 'isFile'}
				]
			}
		},
		targethtml: {
			dist: {
				options: {
					curlyTags: {
						rlsdate: '<%= grunt.template.today("ddmmyyyyhMMss") %>'
					}
				},
				files: {
					'dist/index.html' : 'app/index.html'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.registerTask('default', ['less', 'watch']);
	grunt.registerTask('build', ['less', 'handlebars', 'uglify', 'copy', 'targethtml']);
};
