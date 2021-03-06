FROM fedora:31

WORKDIR /app
COPY . /app

RUN dnf install -y gcc-c++ make
RUN curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
RUN dnf install -y nodejs

RUN npm install \
    && npm run build

EXPOSE 3000
EXPOSE $PORT

RUN dnf install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm

CMD ["npm", "start"]
