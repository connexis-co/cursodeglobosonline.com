import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blogSeoError,duplicateKeyword} from '../src/plugins/globos-integrity/blog-seo.ts';
test('publishing distinguishes informational blog intent from commercial course intent',()=>{
 assert.ok(blogSeoError({primary_keyword:''}));
 assert.ok(blogSeoError({primary_keyword:'Curso de globoflexia'}));
 assert.equal(blogSeoError({primary_keyword:'Cómo hacer un perro con un globo'}),undefined);
 assert.ok(blogSeoError({primary_keyword:'Globoflexia',body:[{_type:'block',style:'h1'}]}));
});
test('duplicate keyword check normalizes accents and punctuation without merging distinct intents',()=>{
 assert.equal(duplicateKeyword({primary_keyword:'¿QUÉ es globoflexia?'},{primary_keyword:'que es globoflexia'}),true);
 assert.equal(duplicateKeyword({primary_keyword:'globos con confeti'},{primary_keyword:'como inflar un globo burbuja'}),false);
 assert.equal(duplicateKeyword({},{primary_keyword:''}),false);
});
