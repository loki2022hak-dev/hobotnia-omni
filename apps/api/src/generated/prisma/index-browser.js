
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  passwordHash: 'passwordHash',
  role: 'role',
  emailVerifiedAt: 'emailVerifiedAt',
  twoFactorSecret: 'twoFactorSecret',
  twoFactorEnabled: 'twoFactorEnabled',
  status: 'status',
  reputation: 'reputation',
  premiumUntil: 'premiumUntil',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  avatarUrl: 'avatarUrl',
  coverUrl: 'coverUrl',
  bio: 'bio',
  city: 'city',
  socialLinks: 'socialLinks',
  stats: 'stats'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  userAgent: 'userAgent',
  ip: 'ip',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt',
  createdAt: 'createdAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  content: 'content',
  type: 'type',
  mediaUrls: 'mediaUrls',
  communityId: 'communityId',
  repostOfId: 'repostOfId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  authorId: 'authorId',
  parentId: 'parentId',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LikeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  postId: 'postId',
  createdAt: 'createdAt'
};

exports.Prisma.SavedPostScalarFieldEnum = {
  userId: 'userId',
  postId: 'postId',
  createdAt: 'createdAt'
};

exports.Prisma.ForumCategoryScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  description: 'description'
};

exports.Prisma.ForumTopicScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  authorId: 'authorId',
  title: 'title',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.CommunityScalarFieldEnum = {
  id: 'id',
  ownerId: 'ownerId',
  name: 'name',
  slug: 'slug',
  description: 'description',
  visibility: 'visibility',
  createdAt: 'createdAt'
};

exports.Prisma.CommunityMemberScalarFieldEnum = {
  userId: 'userId',
  communityId: 'communityId',
  role: 'role',
  joinedAt: 'joinedAt'
};

exports.Prisma.ChatScalarFieldEnum = {
  id: 'id',
  title: 'title',
  isGroup: 'isGroup',
  createdAt: 'createdAt'
};

exports.Prisma.ChatMemberScalarFieldEnum = {
  chatId: 'chatId',
  userId: 'userId',
  joinedAt: 'joinedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  chatId: 'chatId',
  authorId: 'authorId',
  content: 'content',
  attachments: 'attachments',
  reactions: 'reactions',
  createdAt: 'createdAt'
};

exports.Prisma.JobPostScalarFieldEnum = {
  id: 'id',
  company: 'company',
  title: 'title',
  description: 'description',
  city: 'city',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.JobApplicationScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  userId: 'userId',
  resumeUrl: 'resumeUrl',
  coverText: 'coverText',
  createdAt: 'createdAt'
};

exports.Prisma.MarketplaceItemScalarFieldEnum = {
  id: 'id',
  sellerId: 'sellerId',
  title: 'title',
  description: 'description',
  price: 'price',
  category: 'category',
  photoUrls: 'photoUrls',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  postId: 'postId',
  commentId: 'commentId',
  reason: 'reason',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  code: 'code',
  title: 'title',
  description: 'description'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  userId: 'userId',
  achievementId: 'achievementId',
  awardedAt: 'awardedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  plan: 'plan',
  status: 'status',
  startsAt: 'startsAt',
  endsAt: 'endsAt'
};

exports.Prisma.SubscriptionPaymentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  plan: 'plan',
  amountUsd: 'amountUsd',
  days: 'days',
  provider: 'provider',
  providerInvoiceId: 'providerInvoiceId',
  invoiceUrl: 'invoiceUrl',
  status: 'status',
  payload: 'payload',
  paidAt: 'paidAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  actorId: 'actorId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  metadata: 'metadata',
  ip: 'ip',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  PREMIUM: 'PREMIUM',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
};

exports.PostType = exports.$Enums.PostType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  LINK: 'LINK'
};

exports.Visibility = exports.$Enums.Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

exports.JobType = exports.$Enums.JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  REMOTE: 'REMOTE'
};

exports.MarketplaceStatus = exports.$Enums.MarketplaceStatus = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  ARCHIVED: 'ARCHIVED'
};

exports.ReportStatus = exports.$Enums.ReportStatus = {
  OPEN: 'OPEN',
  REVIEWING: 'REVIEWING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  MESSAGE: 'MESSAGE',
  SYSTEM: 'SYSTEM',
  REPORT: 'REPORT'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Profile: 'Profile',
  RefreshToken: 'RefreshToken',
  Post: 'Post',
  Comment: 'Comment',
  Like: 'Like',
  SavedPost: 'SavedPost',
  ForumCategory: 'ForumCategory',
  ForumTopic: 'ForumTopic',
  Community: 'Community',
  CommunityMember: 'CommunityMember',
  Chat: 'Chat',
  ChatMember: 'ChatMember',
  Message: 'Message',
  JobPost: 'JobPost',
  JobApplication: 'JobApplication',
  MarketplaceItem: 'MarketplaceItem',
  Report: 'Report',
  Notification: 'Notification',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement',
  Subscription: 'Subscription',
  SubscriptionPayment: 'SubscriptionPayment',
  AuditLog: 'AuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
