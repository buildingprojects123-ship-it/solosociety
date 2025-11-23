import { NextResponse } from 'next/server'
import { MOCK_OTP } from '@/lib/constants'

export async function GET() {
    return NextResponse.json({
        mockOtp: MOCK_OTP,
        message: 'This endpoint shows the MOCK_OTP value being used'
    })
}
