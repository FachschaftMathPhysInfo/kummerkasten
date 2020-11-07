
FROM phusion/passenger-customizable:0.9.34
LABEL vendor="Fachschaft MathPhysInfo"
MAINTAINER Henrik Reinstädtler <henrik@mathphys.stura.uni-heidelberg.de>
RUN apt-get update && \
    apt-get install -y gnupg2 dirmngr && \
    gpg2 --recv-keys 7D2BAF1CF37B13E2069D6956105BD0E739499BDB && \
    curl -sSL https://rvm.io/mpapis.asc | gpg2 --import - && \
    /pd_build/ruby-2.3.7.sh && \
    /pd_build/redis.sh


# Enable the Redis service.
RUN rm -f /etc/service/redis/down
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
build-essential  nodejs npm libpq-dev wget git cron

ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/bin/bash","-c","/sbin/my_init | tee /home/app/kummerkasten/log/stdout.log"]
#update nodejs
RUN npm cache clean -f
RUN npm install -g n
RUN n 8
RUN npm install -g npm
RUN npm install -g bower
RUN npm install -g ember-cli
ENV INSTALL_PATH /home/app/kummerkasten

#Ordner erstellen und wechseln
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

#Gemfile kopieren
COPY --chown=app Gemfile Gemfile.lock ./
#bundles installieren
RUN gem install bundler
RUN DEBUG_RESOLVER=1 bundler install --binstubs --verbose
#und den rest kopieren
COPY --chown=app . .
ENV RAILS_ENV production
ENV EMBER_ENV development
RUN RAILS_ENV=production PRODUCTION_DATABASE_ADAPTER="postgresql" bundle exec rake assets:precompile
RUN bash gem install whenever
RUN rm -rf /kummerkasten/tmp/pids && bundle exec whenever --update-crontab
RUN rm -f /etc/service/nginx/down
ADD webapp.conf /etc/nginx/sites-enabled/webapp.conf
ADD postgres-env.conf /etc/nginx/main.d/postgres-env.conf
# Queue classic für mails
RUN mkdir -p /etc/service/queue_classic
ADD queue_classic.sh /etc/service/queue_classic/run
RUN chmod 755 /etc/service/queue_classic/run
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
