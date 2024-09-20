import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function fetchSchools(req, res) {
  if (req.method === "GET") {
    try {
      const school = await prisma.school.findMany({
        take: 100, // Limit to 100 records
      });      
      res.status(200).json(school); // Return the schools data
    } catch (error) {
      console.error("Error fetching schools:", error);
      res.status(500).json({ error: "Failed to fetch schools" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
