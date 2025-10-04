import mongoose, { Query } from 'mongoose';

// 🔹 QueryParams Interface যেমন ?keyword=abc&page=2&limit=10 ইত্যাদি।

export interface QueryParams {
  keyword?: string;
  author?: string;
  category?: string;
  tags?: string | string[];
  page?: string | number;
  limit?: string | number;
  newest?: boolean;
  [key: string]: any; // যেকোনো extra query
}

// Generic class for handling search, filter, pagination, sorting.
export class ApiFeatures<DocType, THelpers = {}> {
  // Mongoose Query object — find(), sort(), limit() ইত্যাদি এখানেই চেইন হবে
  // DocType is Mongoose Document Type and THelpers Custom Types
  query: Query<DocType[], DocType, THelpers>;

  constructor(
    query: Query<DocType[], DocType, THelpers>,
    private readonly queryStr: QueryParams,
  ) {
    this.query = query;
  }

  /** 🔍 Keyword-based search */
  search(): this {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword;

      this.query = this.query.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  /** 🧩 Filtering by author, category, tags, etc. */
  filter(): this {
    const queryCopy = { ...this.queryStr };

    // এগুলো filter এ লাগবে না
    const removeFields = [
      'keyword',
      'author',
      'category',
      'tags',
      'page',
      'limit',
      'newest',
    ];
    removeFields.forEach((key) => delete queryCopy[key]);

    const filterConditions: Record<string, any> = {};

    // 🔹 Helper function: string কে ObjectId তে convert
    const toObjectId = (value: string) =>
      mongoose.Types.ObjectId.isValid(value)
        ? new mongoose.Types.ObjectId(value)
        : value;

    // 🧠 Author filter
    if (this.queryStr.author)
      filterConditions.author = toObjectId(this.queryStr.author).toString();

    // 🧠 Category filter
    if (this.queryStr.category)
      filterConditions.category = toObjectId(this.queryStr.category);

    // 🔹 Tags filter
    if (this.queryStr.tags) {
      if (Array.isArray(this.queryStr.tags) && this.queryStr.tags.length > 0) {
        // Multiple tags: match posts that have ALL the tags
        this.query = this.query.find({ tags: { $all: this.queryStr.tags } });
      } else if (typeof this.queryStr.tags === 'string') {
        // Single tag: match posts that have the tag
        this.query = this.query.find({ tags: this.queryStr.tags });
      }
    }

    // 🧩 Extra fields
    Object.assign(filterConditions, queryCopy);
    // অবশেষে query apply
    this.query = this.query.find(filterConditions);

    return this;
  }

  /** ✅ Approved filter */
  approved(approval: boolean): this {
    this.query = this.query.find({ approved: approval });
    return this;
  }

  /** 🕒 Sort by newest or oldest */
  sortByNewest(): this {
    if (this.queryStr.newest) {
      this.query = this.query.sort({ createdAt: -1 }); // Newest first
    } else {
      this.query = this.query.sort({ createdAt: 1 }); // Oldest first
    }
    return this;
  }

  /** 📦 Pagination, Limiting the results per page */
  pagination(defaultLimit = 3): this {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}
