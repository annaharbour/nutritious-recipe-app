const sharp = require("sharp");
const {
	S3Client,
	ListBucketsCommand,
	PutObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccessKey = process.env.BUCKET_ACCESS_KEY;
const bucketSecretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY;
// Create an S3 service object
const s3Client = new S3Client({
	region: bucketRegion,
	credentials: {
		accessKeyId: bucketAccessKey,
		secretAccessKey: bucketSecretAccessKey,
	},
});

// Define the path to the ingredientImages folder
const folderPath = path.join(__dirname, "images");

// Read the contents of the folder
fs.readdir(folderPath, async (err, files) => {
	if (err) {
		console.error("Error reading folder:", err);
		return;
	}

	// Iterate over each file in the folder
	for (const file of files) {
		try {
			// Create a stream to read the file
			const filePath = path.join(folderPath, file);
			const fileBuffer = await fs.promises.readFile(filePath);

			// Resize the image using sharp and get the buffer
			const resizedBuffer = await sharp(fileBuffer)
				.resize({ width: 250, height: 250, fit: "contain" })
				.toBuffer();

			// Set the S3 object parameters
			const params = {
				Bucket: bucketName,
				Key: `images/ingredients/${file}`,
				Body: resizedBuffer,
				ContentType: "image/jpeg",
			};

			// Upload the file to S3
			const command = new PutObjectCommand(params);
			const data = await s3Client.send(command);

			console.log("File uploaded successfully:", data.file);
		} catch (err) {
			console.error("Error uploading file:", err);
		}
	}
});
