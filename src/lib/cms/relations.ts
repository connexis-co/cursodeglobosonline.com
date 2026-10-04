/** Reference fields are the authority; text slugs are presentation values only. */
export const RELATIONS:Record<string,Record<string,{target:string;output:string;multiple?:boolean;required?:boolean}>>={
 courses:{subcategory_link:{target:'subcategories',output:'subcategory',required:true},producer_link:{target:'producers',output:'producer',required:true}},
 subcategories:{category_link:{target:'categories',output:'category',required:true}},
 blog:{cluster_link:{target:'clusters',output:'cluster',required:true},author_link:{target:'authors',output:'author',required:true},course_link:{target:'courses',output:'moneyPage'},pillar_link:{target:'blog',output:'pillar'},related_links:{target:'blog',output:'related',multiple:true}},
 cities:{country_link:{target:'countries',output:'country',required:true}},
 testimonials:{course_link:{target:'courses',output:'courseSlug'}},videos:{course_link:{target:'courses',output:'course'}},
 promotions:{country_links:{target:'countries',output:'countries',multiple:true},course_links:{target:'courses',output:'courses',multiple:true},excluded_course_links:{target:'courses',output:'excludedCourses',multiple:true}},
};
export const RETIRED_FIELDS:Record<string,string[]>={courses:['category','subcategory','producer'],blog:['cluster','author','money_page','pillar','related'],cities:['country'],testimonials:['course_slug'],videos:['course'],promotions:['countries','courses','excluded_courses'],categories:['subcategories']};
