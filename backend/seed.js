const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/Users/User');
const Category = require('./models/Categories/Category');
const Post = require('./models/Posts/Post');
const Comment = require('./models/Comments/Comment');

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing old sample collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log('Existing collections cleared.');

    console.log('Creating sample authors...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    const user1 = await User.create({
      username: 'alex_architect',
      email: 'alex@blogitech.dev',
      password: passwordHash,
      role: 'admin',
      isVerified: true,
      accountLevel: 'gold',
      bio: 'Principal Systems Architect specializing in distributed consensus, event-driven architectures, and high-throughput systems.',
      location: 'San Francisco, CA',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const user2 = await User.create({
      username: 'sarah_cloud',
      email: 'sarah@blogitech.dev',
      password: passwordHash,
      role: 'user',
      isVerified: true,
      accountLevel: 'silver',
      bio: 'Staff DevOps & Reliability Engineer. Passionate about Kubernetes operator patterns, edge compute, and zero-trust networks.',
      location: 'Seattle, WA',
      profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    });

    const user3 = await User.create({
      username: 'marcus_fe',
      email: 'marcus@blogitech.dev',
      password: passwordHash,
      role: 'user',
      isVerified: true,
      accountLevel: 'bronze',
      bio: 'Frontend Architect focused on React Server Components, WebAssembly, and compiler-driven UI performance.',
      location: 'Berlin, Germany',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    // Setup social connections
    user1.following.push(user2._id, user3._id);
    user2.followers.push(user1._id);
    user3.followers.push(user1._id);
    await Promise.all([user1.save(), user2.save(), user3.save()]);

    console.log('Creating sample categories...');
    const cat1 = await Category.create({
      name: 'Distributed Systems',
      author: user1._id,
    });
    const cat2 = await Category.create({
      name: 'Cloud & Kubernetes',
      author: user2._id,
    });
    const cat3 = await Category.create({
      name: 'Frontend Architecture',
      author: user3._id,
    });
    const cat4 = await Category.create({
      name: 'Database Engineering',
      author: user1._id,
    });

    console.log('Creating sample articles...');
    const post1 = await Post.create({
      title: 'Architecting Distributed Consensus: Raft vs Multi-Paxos in Production',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      claps: 42,
      content: `When engineering systems that require fault-tolerant linearizability across geographical zones, distributed consensus remains one of the hardest challenges in software engineering.

In this deep-dive, we examine the practical trade-offs between Multi-Paxos and Raft when deployed across modern multi-region cloud infrastructures. While Raft was deliberately designed for understandability with a strong leader paradigm, real-world edge cases around leader election flaps and asynchronous disk writes still introduce surprising latency spikes.

### Key Architectural Considerations:
1. Leader leases and monotonic clock boundaries
2. Pipelined log replication without head-of-line blocking
3. Dynamic cluster reconfiguration and quorum intersections

Designing for predictable p99.9 latency under network partitions requires careful configuration of heartbeat intervals and snapshot compacting strategies.`,
      author: user1._id,
      category: cat1._id,
      likes: [user2._id, user3._id],
    });

    const post2 = await Post.create({
      title: 'Zero-Downtime Database Migrations in High-Throughput Environments',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      claps: 28,
      content: `Executing schema changes on a production database processing thousands of writes per second is akin to replacing an airplane engine mid-flight.

A naive \`ALTER TABLE\` or missing compound index can acquire an exclusive table lock, causing query queues to back up and eventually bringing down upstream microservices.

### The Expand-and-Contract Migration Pattern
To eliminate table locking entirely:
- **Phase 1 (Expand)**: Introduce the new column or table without removing the old schema. Update application code to dual-write to both old and new structures.
- **Phase 2 (Backfill)**: Run asynchronous background workers to backfill legacy rows in chunked, rate-limited batches.
- **Phase 3 (Contract)**: Switch application reads to the new schema, deprecate writes to the old columns, and finally drop deprecated fields during an off-peak maintenance window.`,
      author: user1._id,
      category: cat4._id,
      likes: [user2._id],
    });

    const post3 = await Post.create({
      title: 'Kubernetes Operator Design: Building Self-Healing Cloud Infrastructure',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
      claps: 35,
      content: `Declarative state management is the cornerstone of modern cloud-native systems. Custom Resource Definitions (CRDs) coupled with Kubernetes Operators enable teams to encode complex operational domain knowledge into software controllers.

In this guide, we analyze the reconciliation loop mechanics, idempotency guarantees, and how to avoid optimistic lock contention when scaling controllers across large fleets.

### Best Practices for Operator Engineering:
- Treat every event trigger as a hint to inspect desired vs actual state.
- Implement exponential backoff for external API retries.
- Use finalizers judiciously to prevent dangling cloud provider resources.`,
      author: user2._id,
      category: cat2._id,
      likes: [user1._id, user3._id],
    });

    const post4 = await Post.create({
      title: 'React Server Components: Mental Models, Streaming & Bundle Elimination',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
      claps: 51,
      content: `The paradigm shift introduced by React Server Components (RSC) fundamentally redefines how client and server boundaries intersect in modern single-page applications.

By executing component logic exclusively on the server and serializing the resulting Virtual DOM tree into a streaming JSON protocol, heavy third-party parsing dependencies never ship to the client device.

### Core Architecture Highlights:
1. Zero bundle size for server-only dependencies (e.g., date formatters, markdown parsers).
2. Direct access to backend databases and caching tiers without bespoke REST endpoints.
3. Selective hydration with Suspense boundaries, delivering progressive interactivity to users on constrained cellular networks.`,
      author: user3._id,
      category: cat3._id,
      likes: [user1._id],
    });

    // Update categories with posts
    cat1.posts.push(post1._id);
    cat4.posts.push(post2._id);
    cat2.posts.push(post3._id);
    cat3.posts.push(post4._id);
    await Promise.all([cat1.save(), cat2.save(), cat3.save(), cat4.save()]);

    // Update authors with posts
    user1.posts.push(post1._id, post2._id);
    user2.posts.push(post3._id);
    user3.posts.push(post4._id);
    await Promise.all([user1.save(), user2.save(), user3.save()]);

    console.log('Adding sample comments...');
    const comment1 = await Comment.create({
      message: 'Phenomenal explanation of Raft leader election edge cases! We encountered similar issues during an AWS AZ partition last quarter.',
      author: user2._id,
      postId: post1._id,
    });
    const comment2 = await Comment.create({
      message: 'The expand-contract pattern has saved our production PostgreSQL cluster multiple times during major v2 releases.',
      author: user3._id,
      postId: post2._id,
    });

    post1.comments.push(comment1._id);
    post2.comments.push(comment2._id);
    await Promise.all([post1.save(), post2.save()]);

    console.log('\n===========================================');
    console.log('✅ SEEDING COMPLETE! Sample data ready:');
    console.log('===========================================');
    console.log('Demo Accounts:');
    console.log('1. Username: alex_architect | Password: Password123! (Role: admin)');
    console.log('2. Username: sarah_cloud    | Password: Password123! (Role: user)');
    console.log('3. Username: marcus_fe      | Password: Password123! (Role: user)');
    console.log('===========================================\n');
  } catch (error) {
    console.error('Seeding failed with error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
}

seedData();

