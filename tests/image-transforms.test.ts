import test from 'node:test';
import assert from 'node:assert/strict';
import {responsiveImage, IMAGE_WIDTHS} from '../src/lib/image-transforms';
const options = {siteUrl:'https://cursodeglobosonline.com', sizes:'(min-width: 1024px) 800px, 100vw'};

test('CMS images use bounded responsive variants with format negotiation and original fallback', () => {
  const image = responsiveImage('/_emdash/api/media/file/course.webp', {...options, maxWidth:1000});
  assert.equal(image.sizes, options.sizes);
  assert.match(image.src, /^\/cdn-cgi\/image\/width=960,quality=80,format=auto,fit=scale-down,onerror=redirect\/_emdash\/api\/media\/file\/course.webp$/);
  assert.equal(image.srcset?.split(', ').length, 6);
  assert.doesNotMatch(image.srcset!, /1280w|1600w/);
  assert.deepEqual(IMAGE_WIDTHS, [96,160,320,480,640,960,1280,1600]);
});

test('private development, remote providers, non-images and already transformed URLs remain untouched', () => {
  const path = '/_emdash/api/media/file/course.webp';
  assert.deepEqual(responsiveImage(path, {...options, siteUrl:'https://dev.cursodeglobosonline.com'}), {src:path});
  for (const src of ['https://other.example/image.jpg', '//other.example/image.jpg', '/api/private.jpg', '/images/logo.svg', '/images/animation.gif', '/images/photo.jpg?token=private', '/images/photo.jpg#crop', '/cdn-cgi/image/width=640/images/photo.jpg', 'https://user:password@cursodeglobosonline.com/images/photo.jpg']) {
    assert.deepEqual(responsiveImage(src, options), {src}, src);
  }
});

test('public absolute media URLs and static images share the same finite variant scheme', () => {
  const image = responsiveImage('https://cursodeglobosonline.com/images/photo.jpg', {...options, maxWidth:Infinity});
  assert.match(image.src, /width=960/);
  assert.match(image.srcset!, /1600w$/);
  assert.doesNotMatch(image.srcset!, /width=Infinity|width=NaN/);
  assert.match(responsiveImage('/images/photo.jpg', {...options, maxWidth:160}).src, /width=160/);
});
