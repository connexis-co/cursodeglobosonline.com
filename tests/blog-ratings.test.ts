import test from 'node:test';
import assert from 'node:assert/strict';
import {isRateablePost,ratingApiPath,ratingStorageKey,parseCourseRating} from '../src/lib/ratings-config.ts';
test('blog votes use stable CMS IDs and never share course storage or endpoints',()=>{
 const id='01M3ZTNW3GZG2RA77W4QC07SNQ';assert.ok(isRateablePost(id));
 for(const bad of ['article-slug',"' OR 1=1",null,'',id.toLowerCase()])assert.equal(isRateablePost(bad),false);
 assert.notEqual(ratingStorageKey('blog',id),ratingStorageKey('courses',id));
 assert.equal(ratingStorageKey('courses','curso-de-globoflexia'),'curso-de-globoflexia');
 assert.notEqual(ratingApiPath('blog'),ratingApiPath('courses'));
});
test('rating display rejects inconsistent aggregates',()=>{
 assert.deepEqual(parseCourseRating({average:4,count:2,distribution:[0,0,1,0,1]}),{average:4,count:2,distribution:[0,0,1,0,1]});
 assert.equal(parseCourseRating({average:5,count:3,distribution:[0,0,0,0,1]}),undefined);
 assert.equal(parseCourseRating({average:NaN,count:1,distribution:[0,0,0,0,1]}),undefined);
});
