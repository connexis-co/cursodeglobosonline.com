import {api,json} from '../dev-api.mjs';
await api('/_emdash/api/schema/collections/blog',json('PUT',{commentsEnabled:true,commentsModeration:'all',commentsAutoApproveUsers:false,commentsClosedAfterDays:0}));
console.log('Blog comments enabled, all submissions require moderation. No comments created.');
