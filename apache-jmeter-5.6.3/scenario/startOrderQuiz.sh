folder_name=$(date +%Y%m%d_%H%M%S)

mkdir -p ../results/local/$folder_name
../bin/jmeter -n -t ../softeer-jmx/orderEventQuizSubmit.jmx -l ../results/local/$folder_name.log -e -o ../results/local/$folder_name
