FROM node:4.8-wheezy

RUN mkdir /bootprint
RUN chmod 777 /bootprint

WORKDIR /bootprint
ADD run.js /bootprint
ADD package.json /bootprint
RUN npm i

ENTRYPOINT ["node", "/bootprint/run.js", "-m", "docker"]