pipeline {
    agent any
    
    options {
        // Discard older builds, keep only last 10
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Print timestamps in console logs
        timestamps()
        // Prevent concurrent builds to protect system memory
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                echo '========== CLEANING WORKSPACE =========='
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                echo '========== CHECKOUT =========='
                checkout scm
                script {
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def branchName = env.BRANCH_NAME ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Git Commit Hash: ${commitHash}"
                    echo "Branch Name: ${branchName}"
                }
            }
        }
        
        stage('Environment Validation') {
            steps {
                echo '========== ENVIRONMENT VALIDATION =========='
                script {
                    try {
                        sh 'docker --version'
                    } catch (Exception e) {
                        error 'Validation Failed: Docker is not installed or not in PATH.'
                    }
                    
                    try {
                        sh 'docker compose version'
                    } catch (Exception e) {
                        error 'Validation Failed: Docker Compose is not available.'
                    }
                    
                    try {
                        sh 'java -version'
                    } catch (Exception e) {
                        error 'Validation Failed: Java (JDK 21) is not available.'
                    }
                    
                    try {
                        sh 'mvn -version'
                    } catch (Exception e) {
                        error 'Validation Failed: Maven (mvn) is not available.'
                    }
                }
            }
        }
        
        stage('Backend Validation') {
            steps {
                echo '========== BACKEND =========='
                dir('smart-erp-backend') {
                    script {
                        try {
                            sh 'mvn clean package -DskipTests'
                        } catch (Exception e) {
                            error 'Backend build failed during compilation/packaging.'
                        }
                    }
                }
            }
        }
        
        stage('Frontend Validation') {
            steps {
                echo '========== FRONTEND =========='
                dir('smart-erp-frontend') {
                    script {
                        try {
                            sh 'npm install'
                            sh 'npm run build'
                        } catch (Exception e) {
                            error 'Frontend build failed during npm compilation.'
                        }
                    }
                }
            }
        }
        
        /* 
        // ====================================================
        // FUTURE READY: Automated Verification Tests
        // ====================================================
        stage('Unit & Integration Tests') {
            steps {
                echo '========== AUTOMATED TESTS =========='
                // dir('smart-erp-backend') { sh 'mvn test' }
                // dir('smart-erp-frontend') { sh 'npm test' }
            }
        }
        */
        
        /* 
        // ====================================================
        // FUTURE READY: Quality Gate & OWASP Scan
        // ====================================================
        stage('Security & Code Quality Gate') {
            steps {
                echo '========== SECURITY AND QUALITY SCAN =========='
                // dir('smart-erp-backend') { sh 'mvn sonar:sonar' }
                // dependencyCheckAdditionalParameters(...)
            }
        }
        */
        
        stage('Docker Build') {
            steps {
                echo '========== BUILD =========='
                script {
                    try {
                        // Builds or updates only changed service images
                        sh 'docker compose build'
                    } catch (Exception e) {
                        error 'Docker compose build failed.'
                    }
                }
            }
        }
        
        stage('Deployment') {
            steps {
                echo '========== DEPLOY =========='
                script {
                    try {
                        // Start containers in daemon mode. Database volumes are kept intact.
                        sh 'docker compose up -d'
                        echo 'Deployment status: SUCCESS'
                    } catch (Exception e) {
                        error 'Deployment failed.'
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                echo '========== CLEANUP =========='
                // Remove dangling Docker images, keeping named volumes intact
                sh 'docker image prune -f'
            }
        }
    }
    
    post {
        always {
            script {
                echo "Build Duration: ${currentBuild.durationString}"
            }
        }
        success {
            echo "========== DEPLOYMENT COMPLETED SUCCESS =========="
            // FUTURE READY: Add Discord/Slack Notification trigger
            // slackSend channel: '#deployments', message: "SmartERP build #${env.BUILD_NUMBER} is live on GCP VM."
        }
        failure {
            echo "========== DEPLOYMENT COMPLETED FAILURE =========="
            // FUTURE READY: Add Failure notification
            // slackSend channel: '#deployments', color: 'danger', message: "SmartERP build #${env.BUILD_NUMBER} failed."
        }
    }
}
