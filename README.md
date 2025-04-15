
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/sreecharan7/empreview">
    <img src="./public/website/logo.png" alt="Logo" width="80">
  </a>

  <h3 align="center">Empreview</h3>

  <p align="center">
  This is a fullstack project of the employee review system in this project you can review other employes with admin permission
    <br />
    <br />
    <br />
    <a href="https://empreview.up.railway.app">View Demo</a>
    ·
    <a href="https://empreview.up.railway.app/#contact-us">Report Bug</a>
    ·
    <a href="https://empreview.up.railway.app/#contact-us">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)


<br>

<!-- ABOUT THE PROJECT -->
# About The Project


## Overview

This project involves the development of an Employee Rating System with a plethora of features aimed at providing a comprehensive and customizable experience. The system facilitates the evaluation of employees based on various criteria, including private comments, comment visibility, and multi-company presence.

## Features

### Employee Ratings

- **Private Comments**: Admins can control the comments to show comments without name.
- **Comment Visibility Control**: Admins can set rules for displaying or hiding comments.
- **Multi-Company Presence**: An employee can be associated with multiple companies.

### User Customization

- **Custom Photos**: Users can upload custom profile photos.
- **Banner (Background) Customization**: Users can set personalized banners.

### Email Features

- **Request to Join Organization**: Admin can send email requests to join an organization to the users.
- **Organization ID Integration**: Users can join an organization by providing an organization ID.
- **Admin Approval Process**: Admins receive requests and can approve or reject them via email.

### Permissions and Controls

- **Rating Permissions**: Admins control user permissions to rate other employees.
- **Admin Promotions and Removals**: Admins can promote or remove employees.
- **Rating Limits**: Admins can set the maximum number of ratings a user can give.

### Admin Controls

- **Employee Management**: Admins can edit or delete ratings and manage employee roles.
- **Organization Control**: Admins can control organization-specific settings.

## Usage

1. **Joining an Organization:**
   - Users can request to join an organization by providing an organization ID.
   - Admins receive requests and can approve or reject them.

2. **Rating Process:**
   - Users can rate other employees based on predefined criteria.
   - Private comments can be added, and visibility is controlled by admin settings.

3. **Admin Controls:**
   - Admins can manage employee roles, including promotions and removals.
   - Edit or delete ratings as needed.

4. **Customization:**
   - Users can customize their profiles with custom photos and banners.

## Project Flexibility

This project is designed to provide flexibility to users and admins through a user-friendly interface and customizable settings. It ensures a seamless and controlled employee rating experience within the organization.

---


### Built With

* [Node js](https://nodejs.org/)
* [Mongo db](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com/)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* Node js
[download](https://nodejs.org/en/download/) [specific version](https://nodejs.org/dist/v20.11.0/)

* npm
```sh
npm install npm@latest -g
```
* Mongo db [download](https://www.mongodb.com/try/download/community) (optional if you have Mongo db Atlas URL)

## Installation

1. **Clone the Repository**
    ```sh
    git clone https://github.com/yvmr-33/Empreview.git
    ```

2. **Install NPM Packages**
    ```sh
    cd empreview
    npm install
    ```

3. **Configure Environment Variables**
    Change the environment variables according to your requirements. The most important ones are `mongodb url`, `email`, `emailpass`, and `base url`.
4. **Run the Project**
    ```sh
    node index
    ```

### For Docker

1. **Configure Docker Environment Variables**
    After cloning, change the environment variables, especially `mongodburl`. Optional for `email`, `emailpass`, and `base url`.

2. **Create Docker Volume**
    ```sh
    docker volume create empreview_data
    ```

3. **Build the Docker Image**
    ```sh
    cd empreview
    docker build -t empreview .
    ```

4. **Create and Run Docker Container**
    ```sh
    docker run -it -d -p 4000:4000 -e PORT=4000 -v empreview_data:/app/public empreview
    ```
    **Note:** Make sure to change the port used in the environment variable if needed.


### Enjoy the Website!

Visit [http://localhost:4000](http://localhost:4000) in your web browser to access the website.
