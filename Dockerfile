FROM node:10
RUN useradd -ms /bin/bash developer
WORKDIR /home/developer/app
RUN cd /home/developer/app
COPY app ./app
RUN cd /home/developer/app
COPY views ./views
COPY solvro_city.json ./
COPY package.json ./
COPY app.js ./
USER developer
#RUN npm install
EXPOSE 3000
CMD [ "node", "app.js" ]

