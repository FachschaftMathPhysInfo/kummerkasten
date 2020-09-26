
FROM phusion/passenger-customizable:1.0.8
LABEL vendor="Fachschaft MathPhysInfo"
MAINTAINER Henrik Reinstädtler <henrik@mathphys.stura.uni-heidelberg.de>

RUN /pd_build/ruby-2.3.8.sh && \
    /pd_build/redis.sh &&  \
    rm -f /etc/service/redis/down && \
    apt-get update && apt-get install -qq -y --no-install-recommends \
    build-essential nodejs npm libpq-dev wget git cron && \
    npm install -g npm@latest

ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/bin/bash","-c","/sbin/my_init | tee /home/app/kummerkasten/log/stdout.log"]
#update nodejs
RUN npm cache clean -f && \
    npm install -g n && \
    n 10 && \
    PATH="$PATH" npm install -g bower && \
    npm install -g ember-cli
ENV INSTALL_PATH /home/app/kummerkasten

#Ordner erstellen und wechseln
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

#Gemfile kopieren
COPY --chown=app Gemfile Gemfile.lock ./
#bundles installieren
RUN gem install bundler -v 1.16.6
RUN DEBUG_RESOLVER=1 bundler install --binstubs --verbose

# und den rest kopieren
COPY --chown=app . .
ENV RAILS_ENV production
ENV EMBER_ENV development
RUN RAILS_ENV=production PRODUCTION_DATABASE_ADAPTER="postgresql" bundle exec rake assets:precompile && \ 
    bash gem install whenever && \
    rm -rf /kummerkasten/tmp/pids && bundle exec whenever --update-crontab && \
    rm -f /etc/service/nginx/down 

ADD webapp.conf /etc/nginx/sites-enabled/webapp.conf
ADD postgres-env.conf /etc/nginx/main.d/postgres-env.conf
# Queue classic für mails
RUN mkdir -p /etc/service/queue_classic
ADD queue_classic.sh /etc/service/queue_classic/run
RUN chmod 755 /etc/service/queue_classic/run \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
