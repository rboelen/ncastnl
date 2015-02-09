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
					'dist/js/scripts.min.js': ['app/scripts/plugins.js', 'app/scripts/main.js']
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
					'dist/css/style.min.css': ['app/less/style.less']
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
					{expand: true, cwd: 'app/fonts/', src: ['*'], dest: 'dist/fonts/'}
				]
			}
		},
		targethtml: {
			dist: {
				files: {
					'dist/index.html' : 'app/index.html',
					'dist/product.html' : 'app/product.html'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.registerTask('default', ['less', 'watch']);
	grunt.registerTask('build', ['less', 'uglify', 'copy', 'targethtml']);
};
