import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { vendorProfileValidationSchema } from 'validationSchema/vendor-profiles';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getVendorProfiles();
    case 'POST':
      return createVendorProfile();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVendorProfiles() {
    const data = await prisma.vendor_profile
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'vendor_profile'));
    return res.status(200).json(data);
  }

  async function createVendorProfile() {
    await vendorProfileValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.vendor_profile.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
