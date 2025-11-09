# building docker image mini os for my app so node 18 alpine -> alpine linux with nodde v18 installed
FROM node:18-alpine

#we have an os alpine linux -> working directory

WORKDIR /app


#copy the package.json file in work dir cwd is /app so i need to copy here 
# can use . or ./ or /app same

COPY package*.json  ./

#run the npm i 
#run not cmd because we just need to setup a image once not everytimee so
#cmd for the serving every time that container runs 
RUN npm install 


# copy the remaining from cwd in host to the cwd in container 
# source to dest 
# can use  ./ ./ or . . or . ./ or ./ . same 

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]


#afterbuild 
#docker run -p 3000:3000 `
#>>   --env-file .env `
#>>   setmytrip-backend

