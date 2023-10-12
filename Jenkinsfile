pipeline {
    agent any
 
    tools {nodejs "NodeJS"}
   
 
    stages {
         stage('BackUp Stage') {
    steps {
        script {
             def currentDateTime = new Date().format("yyyyMMdd_HHmmss") // Get the current date and time in the specified format
            def backupFolder = "C:\\IISDemo\\BackUp_Pipeline_Angular_2\\${currentDateTime}"
echo "Output: ${backupFolder}"
            // Create the backup folder
          //
        bat "mkdir ${backupFolder}"
            // Check if node_modules directory exists
            if (fileExists('node_modules')) {
                // If it exists, remove it
                bat 'rmdir /s /q node_modules'
            } else {
                echo 'node_modules directory not found. Skipping removal.'
            }
            // Copy the contents of the "dist" directory to the backup location
            // Use /exclude to exclude the backup folder from the copy

bat 'xcopy /s /y "*.*" "C:\\IISDemo\\BackUp_Pipeline_Angular_2\\20230926_124102"'
        }
    }
}
         stage('Checkout Stage') {
            steps {
                git credentialsId: '462fb42f-257f-4d80-a5ff-6feb8a51f9d9', url: 'https://github.com/RajanikantNewel/IISDemo.git', branch: 'master'
            }
        }
         stage('Install Dependencies') {
            steps {
              bat 'npm install'
            }
        }
         stage('Build') {
            steps {
                // Build the Angular application
                bat 'npm run build'
            }
        }
         stage('Deploy to IIS') {
            steps {
                bat 'xcopy /s /y "dist\\iisdemo\\*" "C:\\IISDemo\\IISDemo2"'
                // Restart IIS to apply changes (adjust the site name as needed)
                //bat 'iisreset /restart /site "AngularJenkins"'
                bat 'C:\\Windows\\System32\\inetsrv\\appcmd stop site /site.name:Demo2'
                bat 'C:\\Windows\\System32\\inetsrv\\appcmd start site /site.name:Demo2'
            }
        }
      }
     post {
    success {
        mail to: 'rajanikant.p@neweltechnologies.com',
             subject: "Success Pipeline: ${currentBuild.fullDisplayName}",
             body: "CI/CD cycle completed"
    }
    failure{
        mail to: "rajanikant.p@neweltechnologies.com",
            subject: "Success Pipeline: ${currentBuild.fullDisplayName}",
            body: "Something is wrong with ${env.BUILD_URL}"
    }
}
    }
 
    

