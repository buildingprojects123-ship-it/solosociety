
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const count = await prisma.user.count()
        console.log('User count:', count)

        const testPhone = '+919999999999'

        console.log('Checking for user:', testPhone)
        let user = await prisma.user.findUnique({
            where: { phone: testPhone },
        })

        if (user) {
            console.log('User found:', user)
        } else {
            console.log('User not found, creating...')
            user = await prisma.user.create({
                data: { phone: testPhone },
            })
            console.log('User created:', user)
        }

        console.log('Database check successful')
    } catch (error) {
        console.error('Database check failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
