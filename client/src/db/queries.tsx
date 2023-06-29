import {PrismaClient} from "@prisma/client";

const prisma: any = new PrismaClient();

export async function getSomeData() {
    try {
        return await prisma.tx_confirmed.findUnique({
            where: {
                tx_hash: Buffer.from("37AEB174C904F9BDB84DCA75856A1316A241C714422E1BF95A1B587214A2BFB8", "hex"),
            },
        })
    } catch (e) {
        console.error("error:", e);
    }
}

export async function closeConnection() {
    await prisma.$disconnect();
}