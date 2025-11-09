# os with node v installed and name it as build so 
#in future we can access this container using build 

FROM node:18-alpine AS build

#this creates a folder cwd as /app so in container the pointer is in /app
# when cwd -> app
WORKDIR /app 

COPY package*.json ./

RUN npm install


#copy cwd in host (.) to cwd of container (.)
COPY . .



RUN npm run build


#the above container already build a dist 
#at the end the react or any tech will be converted to (html css js) -> dist


#production stage
#container with os and node env

#in this i need to take a build container ref and copy the dist 
#serve those dist 



# important 
# above it creates a temp container and builds and stores a snapshot or /app/dist <- build 

#next we create a another os with alpine and node and agin we declare /app then copy those snapshot 



FROM node:18-alpine

#to serve we need install npm i -g serve globally
WORKDIR  /app


RUN npm i -g serve


#here we need to copy the dist which is in /app/dist to this container ./dist or /app/dist
# delete the temp container 


# here /app/dist conatins inde.html in.js someting 
# file system 
# /app
#     /dist      it copies inde.html and .css and .js 

#but if i just use /app/dist and . then
# app
#    inde.html
#    .css similarly 

#so we use /app/dist or ./dist (.)-> cwd  (./) <- cwd 

COPY --from=build /app/dist /app/dist

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173" ]
# the cmd serve serve this -s is  a flag means serve this file as a single page Applin and -l listen on port 3000 
# -s i needed for react
# if i move /dashboard or /contact it serve the same index.html 
# does not give 404 not found











