
FROM ruby:2.4-slim
LABEL vendor="Fachschaft MathPhys"
MAINTAINER Henrik Reinstädtler <henrik@mathphys.fsk.uni-heidelberg.de>

RUN apt-get update && apt-get install -qq -y --no-install-recommends \
build-essential  nodejs npm libpq-dev wget git

RUN ln -s /usr/bin/nodejs /usr/bin/node
#update nodejs
RUN npm cache clean -f
RUN npm install -g n
RUN n 8
RUN npm install -g bower
RUN npm install -g ember-cli
ENV INSTALL_PATH /kummerkasten

#Ordner erstellen und wechseln
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

#Gemfile kopieren
COPY Gemfile Gemfile.lock ./
#bundles installieren
RUN bundle install --binstubs
#und den rest kopieren
COPY . .
