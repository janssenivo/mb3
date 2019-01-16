#!/bin/sh

# This script gets run inside each webserver instance upon launch via cloudformation init scripts
# It edits the index.php page with static info about placement and database credentials

export INTERNALIP=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
export AZ=$(curl http://169.254.169.254/latest/meta-data/placement/availability-zone)

sed -i -r s/@@INTERNALIP@@/${INTERNALIP}/g /var/www/html/index.php
sed -i -r s/@@S3SOURCE@@/${S3Source}/g /var/www/html/index.php
sed -i -r s/@@REGION@@/${Region}/g /var/www/html/index.php
sed -i -r s/@@AZ@@/${AZ}/g /var/www/html/index.php
sed -i -r s/@@DBENDPOINT@@/${DBEndpoint}/g /var/www/html/index.php
sed -i -r s/@@DBNAME@@/${DBName}/g /var/www/html/index.php
sed -i -r s/@@DBUSERNAME@@/${DBUsername}/g /var/www/html/index.php
sed -i -r s/@@DBPASSWORD@@/${DBPassword}/g /var/www/html/index.php

