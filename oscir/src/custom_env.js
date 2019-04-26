/*
* Replace this file in the docker container to override environment settings. eg:
* In docker-compose

  oscir_ui:
    image: oscir_ui-v0.1
    restart: always
    depends_on:
      - oscir_api    
    ports:
      - 80:80
    volumes:
      - ./custom_env.js:/usr/share/nginx/html/custom_env.js #map your local file into the container

*/

window.custom_environment = {
 //   api_url: 'http://your_custom_server:5002' //no trailing slash /
      api_url: 'http://10.0.92.16:5000'
};

