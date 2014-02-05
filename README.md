Questoria Comment Board
========================

Welcome to the Questoria Comment Board - a comments board application based on Symfony2.

This document contains information on how to download, install, and start
using application. For a more detailed explanation, see the [Installation](#1-installation)
chapter of this doc.

1) Installation
----------------------------------

You need to install all the necessary dependencies. Download [***composer***][1] and run the
following commands:

    php composer.phar install
    php ./app/console doctrine:schema:create
    php ./app/console doctrine:schema:update --force

Enjoy!

[1]: https://getcomposer.org/