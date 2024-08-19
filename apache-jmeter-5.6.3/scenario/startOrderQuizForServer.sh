folder_name=$(date +%Y%m%d_%H%M%S)

mkdir -p ../results/server/$folder_name
../bin/jmeter -n -t ../softeer-jmx/orderEventQuizSubmitForServer.jmx -l ../results/server/$folder_name.log -e -o ../results/server/$folder_name
