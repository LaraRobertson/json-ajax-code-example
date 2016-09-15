module.exports = function(grunt) {

	var config = grunt.file.readJSON('config.json');

	//Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('config.json'),
		package_name: '<%= pkg.name %>',
		date: grunt.template.today('mm-dd-yyyy'),
		
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: '<%= package_name %>.zip'
				},
				expand: true,
				cwd: '.',
				src: ['**', '!*.zip', '!*.ini', '!*.log', '!*.cache', '!Gruntfile.js', '!package.json', '!*.sublime-project', '!*.sublime-workspace']
			},

			dev: {
				options: {
					mode: 'zip',
					archive: '<%= package_name %>_dev_<%= date %>.zip'
				},
				expand: true,
				cwd: '.',
				src: ['**',  '!portal/*', '!*.jsp', '!*.zip', '!*.ini', '!*.log', '!*.cache', '!Gruntfile.js', '!package.json', '!*.sublime-project', '!*.sublime-workspace']
			},

			uat: {
				options: {
					mode: 'zip',
					archive: '<%= package_name %>_uat_<%= date %>.zip'
				},
				expand: true,
				cwd: '.',
				src: ['**', '!*.zip', '!*.ini', '!*.log', '!*.cache', '!Gruntfile.js', '!package.json', '!*.sublime-project', '!*.sublime-workspace']
			},

			production: {
				options: {
					mode: 'zip',
					archive: '<%= package_name %>_production_<%= date %>.zip'
				},
				expand: true,
				cwd: '.',
				src: ['**', '!*.zip', '!*.ini', '!*.log', '!*.cache', '!Gruntfile.js', '!package.json', '!*.sublime-project', '!*.sublime-workspace']
			}
		},

		less: {
			production: {
				options: {
					paths: ["stylesheets"]
				},
				files: {
					"stylesheets/master.css":"stylesheets/master.less"
				}
			}
		},

		riot: {
			options: {
				concat : true
			},
			dist: {
		        src: 'tags/*.tag',
		        dest: 'tags/opui.tags.js'
		    }
		},

		watch: {
		  dev: {
		    tasks: ['riot:dist', 'less:production'],
		    files: ['tags/*.tag', '**/*.less'],
		    options: {
		      spawn: false
		    }
		  }
		}

		
	});


	grunt.task.loadTasks(config.utils_path + '/node_modules/grunt-contrib-compress/tasks');
	grunt.task.loadTasks(config.utils_path + '/node_modules/grunt-contrib-less/tasks');
	grunt.task.loadTasks(config.utils_path + '/node_modules/grunt-riot/tasks');
	grunt.task.loadTasks(config.utils_path + '/node_modules/grunt-contrib-watch/tasks');



	// Default task(s)
	// 
	
	grunt.registerTask('testCWD', function(){
		grunt.log.writeln(process.cwd())
	})



	grunt.registerTask('package:UAT', ['less:production', 'riot:dist', 'compress:uat']);
	grunt.registerTask('package:DEV', ['less:production', 'riot:dist', 'compress:dev']);
	grunt.registerTask('package:PRODUCTION', ['less:production', 'riot:dist', 'compress:production']);

	grunt.registerTask('opui-watch', ['watch:dev']);


	grunt.registerTask('lessc', ['less:production']);

	grunt.registerTask('riot-compile', ['riot:dist']);

	// grunt.registerTask('update', ['copy:update']);

	// grunt.registerTask('update-package', ['copy:update', 'less:production', 'compress']);


	
}