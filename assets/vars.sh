#!/bin/sh
export INTERNALIP=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
sed -i -r s/@@INTERNALIP@@/${INTERNALIP}/g /var/www/html/index.php
sed -i -r s/@@S3SOURCE@@/${S3Source}/g /var/www/html/index.php
sed -i -r s/@@REGION@@/${Region}/g /var/www/html/index.php
sed -i -r s/@@DBENDPOINT@@/${DBEndpoint}/g /var/www/html/index.php
sed -i -r s/@@DBNAME@@/${DBName}/g /var/www/html/index.php
sed -i -r s/@@DBUSERNAME@@/${DBUsername}/g /var/www/html/index.php
sed -i -r s/@@DBPASSWORD@@/${DBPassword}/g /var/www/html/index.php

