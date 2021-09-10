Vagrant.configure("2") do |config|
  config.vm.box = "velocity42/xenial64"
  config.vm.provider "virtualbox" do |vb|
    vb.memory="2048"
  end
  config.vm.network :forwarded_port, host: 8080, guest: 80, host_ip: '128.114.25.244', guest_ip: '127.0.0.1'
  config.vm.provision :shell, inline: <<-SHELL

#run app
cd /vagrant
sudo apt-get update
sudo apt-get install libpq-dev nginx
sudo apt autoremove
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
python3 get-pip.py
export PATH=/home/vagrant/.local/bin:$PATH
source env/bin/activate
sudo python3 -m pip install psycopg2
python3 -m gunicorn -b 127.0.0.1:80 backend.wsgi


SHELL
config.vm.provision :shell, :inline => "sudo supervisorctl restart all", run: "always"
config.vm.provision :shell, :inline => "if [ $(fgrep -c /vagrant/bin /home/vagrant/.bashrc) -eq 0 ]; then echo 'export PATH=$PATH:/vagrant/bin' >> /home/vagrant/.bashrc; fi", run: "always"
end
