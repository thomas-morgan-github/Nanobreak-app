module.exports = function(grunt) { 

	
	// Configure main project settings
	grunt.initConfig({

		// Basic settings and info about our plugins 
		pkg: grunt.file.readJSON('package.json'),

        // Names of plugin without the "grunt-contrib-"
        less: {
	      development: {
	        options: {
	          compress: true,
	          yuicompress: true,
	          optimization: 2
	        },

	        files: [{
                expand: true,        // Enable dynamic expansion.
                cwd: 'less/',  // Src matches are relative to this path.
                src: ['*.less'],     // Actual pattern(s) to match.
                dest: 'css/',  // Destination path prefix.
                ext: '.css',         // Dest filepaths will have this extension.
            }]
	      }
	    },
	    
	    watch: {
	      styles: {
	        files: ['less/*.less'], // which files to watch
	        tasks: ['less', 'notify:less'],
	        options: {
	          nospawn: true
	        }
	      }
	    },

        notify: {
		    less:{
		        options:{
		            title: "CSS Files built",
		            message: "Less task complete"
		        }
		    }
		},

		browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'css/*.css',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    // server: './dist'
                    // proxy: 'localhost:8080'
                }
            }
        }

	 });


	// load npm tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-browser-sync');


    // Do the task
     grunt.registerTask('default', ['less','browserSync','watch']);

};