echo "===== DockerBuild UI version $1 ====="
docker build -f ./Dockerfile -t oscir_ui:$1 .
