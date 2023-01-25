# MEAN Stack CRUD Dating App

<table>
<tbody>
	<tr>
		<td>Frontend</td>
		<td>Angular, HTML, CSS</td>
	</tr>
	<tr>
		<td>Backend</td>
		<td>Node.js, express.js</td>
	</tr>
	<tr>
		<td>Database</td>
		<td>MongoDB, AtlasDB</td>
	</tr>
  	<tr>
		<td>Miscellaneous</td>
		<td>mongoose, Pusher, Cloudinary, Heroku, QR</td>
	</tr>
</tbody>
</table>

# Info

A MEAN Stack CRUD app where you can register as a user and view all registred members.

You can communicate with any registred user by clicking the messages button, the messages are sent with pusher.io.

As a user you can like any registred user. You can go to ***"My Connections"*** to view all users you liked, If a user liked you simply click on ***"Members Who Liked Me"***.

You can reset your password only by typing the right randomly generated code, the code will be sent to your email, or you can scan a qr code to get the input code.

You can upload your profile picture by using the cloudinary api. Any logged in user will see your profile image.

Yoy can update your information like: city, country, intro and interests.

You can view all your mailbox under ***"Mail"***, you could also delete any messages *you* sent.

## Instructions

***You can run the project on your local machine, follow the instructions below:***
#
**1)** First Make sure you have **MongoDB**, **Node.js** and **Angular CLI** installed.
#
**2)** Add your Cloudinary config in `cloudinary.js` If you dont have a cloudinary account create one to upload images to Cloudinary.

![image](https://user-images.githubusercontent.com/80118008/189526350-b5a76ae8-319e-4e7d-b8f4-7dece4ee4a5b.png)
#

**3)** Add your Pusher config in `user.route.js`.

![image](https://user-images.githubusercontent.com/80118008/189526299-7816f722-dde1-45d0-9da5-dc8122a38e3d.png)
#
**4)** Open two terminals, cd into ***API*** on the first terminal and cd into ***client*** on the second.
#
**5)** In the ***API*** folder type `nodemon start` to initialize the database. afterwars terminate the proccess via `ctrl + c`.
#
**6)** In the ***API*** folder type `seeder -i`to populate the database with users, after its done you can run `nodemon start` again to start the server.
#
**7)** In the ***client*** folder type `npm install` to install all projects dependent packages.
#
**8)** After all packages are installed, run `ng serve` inside the client folder.
#
**9)** Navigate to `http://localhost:4200`.

![image](https://user-images.githubusercontent.com/80118008/188896901-9f96ce06-ecde-419d-a290-724c30b6410d.png)


