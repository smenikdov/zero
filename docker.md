*image* - образ, шаблон для создания контейнера. Содержит в себе
все необходимое для запуска приложения: код, среду выполнения,
библиотеки, переменные окружения и файлы конфигурации.

*base image* - базовый образ, не имеет родительского образа. Обычно это образы с операционной системой

*child image* - дочерний образ, построен на базовом образе и обладает дополнительной функциональностью

Так же есть официальные образы (поддерживаются командой docker, обычно в названии имеют только одно слово) и пользовательские образы.

*image tag* - снимок образа

*container* - контейнер, завёрнутое и запущенное приложение на основе образа.

*registry* - репозиторий, в котором хранятся образы. Может быть как локальным, так и публичным.
Репозитории создают на платформах вроде Docker Hub и GitLab и размещаю
в них образы с описанием, разными версиями и тегами.

*Docker Hub* - публичный репозиторий образов.

*daemon* - демон докера, фоновый процесс, который управляет Docker-объектами: сетями, хранилищами, образами и контейнерами.

*client* - утилита, которая позволяет пользователю взаимодействовать в демоном

*Dockerfile* - файл-инструкция для сборки образа.

*Docker Desktop* - GUI-клиент

*docker compose* - инструмент для запуска многоконтейнерных приложений

*network* - сеть, которая объединяет контейнеры, чтобы они могли взаимодействовать между собой

*volumes* - механизм для хранения данных вне контейнера для решения совместного использования файлов



=================================================================================
=================================================================================



*docker run*
Run a command in a new Docker container

- Run command in a new container from a tagged image:
`docker run image:tag command`

- Run command in a new container in background and display its ID:
`docker run [-d|--detach] image command`

- Run command in a one-off container in interactive mode and pseudo-TTY:
`docker run --rm [-i|--interactive] [-t|--tty] image command`

- Run command in a new container with passed environment variables:
`docker run [-e|--env] 'variable=value' [-e|--env] variable image command`

- Run command in a new container with bind mounted volumes:
`docker run [-v|--volume] /path/to/host_path:/path/to/container_path image command`

- Run command in a new container with published ports:
`docker run [-p|--publish] host_port:container_port image command`

- Run command in a new container overwriting the entrypoint of the image:
`docker run --entrypoint command image`

- Run command in a new container connecting it to a network:
`docker run --network network image`


*docker pull*
Download Docker images from a registry

- Download a specific Docker image:
`docker pull image:tag`

- Download a specific Docker image in quiet mode:
`docker pull [-q|--quiet] image:tag`

- Download all tags of a specific Docker image:
`docker pull [-a|--all-tags] image`

- Download a Docker images for a specific platform, e.g. linux/amd64:
`docker pull --platform linux/amd64 image:tag`

- Display help:
`docker pull [-h|--help]`


*docker images*
Manage Docker images

- List all Docker images:
`docker images`

- List all Docker images including intermediates:
`docker images [-a|--all]`

- List the output in quiet mode (only numeric IDs):
`docker images [-q|--quiet]`

- List all Docker images not used by any container:
`docker images [-f|--filter] dangling=true`

- List images that contain a substring in their name:
`docker images "*name*"`

- Sort images by size:
`docker images --format "{{.ID}}\t{{.Size}}\t{{.Repository}}:{{.Tag}}" | sort -k 2 -h`


*docker ps*
List Docker containers

- List currently running Docker containers:
`docker ps`

- List all Docker containers (running and stopped):
`docker ps [-a|--all]`

- Show the latest created container (includes all states):
`docker ps [-l|--latest]`

- Filter containers that contain a substring in their name:
`docker ps [-f|--filter] "name=name"`

- Filter containers that share a given image as an ancestor:
`docker ps [-f|--filter] "ancestor=image:tag"`

- Filter containers by exit status code:
`docker ps [-a|--all] [-f|--filter] "exited=code"`

- Filter containers by status (created, running, removing, paused, exited and dead):
`docker ps [-f|--filter] "status=status"`

- Filter containers that mount a specific volume or have a volume mounted in a specific path:
`docker ps [-f|--filter] "volume=path/to/directory" --format "table .ID\t.Image\t.Names\t.Mounts"`


*docker rm*
Remove containers

- Remove containers:
`docker rm container1 container2 ...`

- Force remove a container:
`docker rm [-f|--force] container1 container2 ...`

- Remove a container and its volumes:
`docker rm [-v|--volumes] container`

- Display help:
`docker rm [-h|--help]`


*docker start*
Start stopped containers

- Display help:
`docker start`

- Start a Docker container:
`docker start container`

- Start a container, attaching `stdout` and `stderr` and forwarding signals:
`docker start [-a|--attach] container`

- Start one or more containers:
`docker start container1 container2 ...`


*docker rmi*
Remove Docker images

- Display help:
`docker rmi`

- Remove one or more images given their names:
`docker rmi image1 image2 ...`

- Force remove an image:
`docker rmi --force image`

- Remove an image without deleting untagged parents:
`docker rmi --no-prune image`


*docker port*
List port mappings or a specific mapping for the container


*docker stop*
Stop one or more running containers


*docker search*
Search Docker Hub for images


*docker info*
Display system-wide information


*docker build*
Build an image from a Dockerfile

- Build a Docker image using the Dockerfile in the current directory:
`docker build .`

- Build a Docker image from a Dockerfile at a specified URL:
`docker build github.com/creack/docker-firefox`

- Build a Docker image and tag it:
`docker build --tag name:tag .`

- Build a Docker image with no build context:
`docker build --tag name:tag - < Dockerfile`

- Do not use the cache when building the image:
`docker build --no-cache --tag name:tag .`

- Build a Docker image using a specific Dockerfile:
`docker build --file Dockerfile .`

- Build with custom build-time variables:
`docker build --build-arg HTTP_PROXY=http://10.20.30.2:1234 --build-arg FTP_PROXY=http://40.50.60.5:4567 .`


*docker network*
Create and manage Docker networks.

- List all available and configured networks on Docker daemon:
`docker network ls`

- Create a user-defined network:
`docker network create --driver driver_name network_name`

- Display detailed information about one or more networks:
`docker network inspect network_name1 network_name2 ...`

- Connect a container to a network using a name or ID:
`docker network connect network_name container_name|ID`

- Disconnect a container from a network:
`docker network disconnect network_name container_name|ID`

- Remove all unused (not referenced by any container) networks:
`docker network prune`

- Remove one or more unused networks:
`docker network rm network_name1 network_name2 ...`


*docker push*

*docker pull*

*docker commit*

*docker login*

*docker logout*

*docker version*

*docker logs*

*docker attach*

*docker kill*

*docker restart*



=================================================================================
=================================================================================



*FROM <image>*
Create a new build stage from a base image.
`FROM node:20.17-alpine`


*RUN <command>*
Execute build commands.
`RUN echo 'we are running some # of cool things'`
`RUN npm install`


*CMD <command>*
Specify default commands.
`CMD node ./src/index.js`


*WORKDIR <path>*
Change working directory.
`WORKDIR /usr/local/app`


*COPY <host-path> <image-path>*
Copy files and directories.
`COPY . .`


*ENTRYPOINT <command>*
Specify default executable.
`ENTRYPOINT quasar dev`


*EXPOSE <port>*
Describe which ports your application is listening on.
`EXPOSE 5000`


*ENV <key>=<value>*
Set environment variables.
`ENV MY_DOG=fluffy`


*ADD <src> <dest>*
Add local or remote files and directories.
`ADD file.txt /usr/src/app/`
`ADD https://example.com/archive.zip /usr/src/app/`


<!-- УСТАРЕЛ -->
<!-- *MAINTAINER <name>* -->
<!-- Specify the author of an image. -->
<!-- `MAINTAINER smenikdov` -->


*LABEL <key>=<value>*
Add metadata to an image.
`LABEL version="1.0"`


*USER <user-or-uid>*
Set user and group ID.
`USER app`



=================================================================================
=================================================================================




*docker-compose version*

*docker-compose version*




            - POSTGRES_USER=${DB_USER}
            - POSTGRES_PASSWORD=${DB_PASSWORD}
            - POSTGRES_DB=${DB_DATABASE}





