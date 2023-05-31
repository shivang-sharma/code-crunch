#!/bin/bash

# Make sure to assign your current user to docker user group by using below command
# sudo usermod -aG docker your_username
# Make sure to make the script executable using below command
# sudo chmod +x trigger.sh

set -e

submissionDir=$1
testDataDir=$2
submissionId=$3
timeout=$4
sandbox=$5
problemId=$6
containerIdFile=$submissionDir/$submissionId.container_id

echo SUBMISSION_DIR:$submissionDir
echo TEST_DATA_DIR:$testDataDir
echo SUBMISSION_ID:$submissionId
echo TIMEOUT:$timeout
echo CONTAINER_ID_FILE:$containerIdFile

container_id=$(docker run -d --name $submissionId -v $submissionDir:/$sandbox/testEngine/submission -v $testDataDir:/$sandbox/testEngine/testData $sandbox ./execute.sh $problemId)
echo $container_id > $containerIdFile
echo CONTAINER_ID:$container_id
exit_code=$(timeout $timeout docker wait $container_id || true)
if [ -z $exit_code ]; then
    echo EXITED:timeout
else
    echo EXITED:$exit_code
fi
kill_container=$(docker kill $container_id &> /dev/null || true)
echo OUTPUT:$(docker logs $submissionId)
docker rm $container_id &> /dev/null
rm $containerIdFile
