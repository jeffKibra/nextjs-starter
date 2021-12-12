import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  //req has method
  if (req.method === "POST") {
    const data = req.body;
    const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://kibra:stinkingFingers101@cluster0.f3es2.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);

    console.log(result);
    client.close();

    res.status(201).json({ message: "Meetup successfully created" });
  }
}
