import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { vendorProfileValidationSchema } from 'validationSchema/vendor-profiles';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.vendor_profile
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getVendorProfileById();
    case 'PUT':
      return updateVendorProfileById();
    case 'DELETE':
      return deleteVendorProfileById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVendorProfileById() {
    const data = await prisma.vendor_profile.findFirst(convertQueryToPrismaUtil(req.query, 'vendor_profile'));
    return res.status(200).json(data);
  }

  async function updateVendorProfileById() {
    await vendorProfileValidationSchema.validate(req.body);
    const data = await prisma.vendor_profile.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteVendorProfileById() {
    const data = await prisma.vendor_profile.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
