#!/usr/bin/env python3
"""prompts_r2.py → trabajos/r2.json. Segunda tanda tras los jueces de r1: luz de ventana y cámara de celular (menos «banco de
imágenes»), cara tres cuartos para que se reconozca el personaje, herramientas simplificadas y retoques puntuales."""
import json
from prompts import REF, REFJ, IDJ
CAM = ("Real photograph taken handheld with a phone's main camera (26mm equivalent), natural overcast window daylight only, "
       "coming from the left; no lamps switched on, no golden glow, neutral white balance, slightly imperfect exposure with "
       "mild clipping at the window, subtle sensor grain, slightly off-center casual framing. True skin texture with visible "
       "pores, faint under-eye shadow, flyaway hairs, natural asymmetry; no retouching, no beauty filter. Balloon colors vivid "
       "and true. ")
LUGAR = ("Bright, clean, well-kept contemporary middle-class Latin American interior, tidy and nicely decorated (a potted "
         "plant, a framed abstract print, light wood shelves). ")
NO = (" Absolutely no text, letters, numbers, logos, watermarks, signs or screens anywhere; every tool, machine, spool, box "
      "and bag is completely plain with no label, sticker or print. No balloon debris on the floor. Latex balloons are round, "
      "never pear-shaped, with small tight knots hidden from view. Rich mix of balloon types and vivid colors: matte latex in "
      "saturated fuchsia, coral, orange, sunny yellow, turquoise and lilac, several chrome metallic latex balloons (gold, rose "
      "gold, silver, metallic blue), and where it fits a smooth, fully inflated foil star or heart and a clear balloon with "
      "confetti inside. Abundant, finished, professional-looking work.")
MANOS = (" Exactly two hands in the picture, both hers, each with five natural fingers, the two hands clearly apart from each "
         "other; short clean natural nails, no rings, no bracelets.")
CARA = ("Her face is turned three-quarters toward the camera, both eyes visible and her features clearly recognizable, while "
        "her eyes look down at her work with a relaxed, pleasant half-smile. ")
DEL = "a deep navy-indigo bib apron with raspberry-coral neck strap and ties, no logo or print"
VALE = (f"The woman is exactly the person in the reference sheet: same face, same small mole, same gold hoop earrings, same "
        f"dark brown wavy hair with caramel balayage ends, tied back in a low ponytail. Latina, early thirties, plain white "
        f"t-shirt under {DEL}. " + CARA)
CARO = (f"The woman is exactly the person in the reference sheet: same face, same moles, same gold hoop earrings, same long "
        f"dark brown wavy hair, tied back in a low ponytail. Latina, early thirties, plain white t-shirt under {DEL}. " + CARA)
JENNY = ("The woman is exactly the person in the three reference photos (same face, same features, same earrings, same body). "
         + IDJ + f" Her long straight jet-black hair is gathered in a low ponytail resting over one shoulder, with the "
         f"face-framing front strands loose. Plain white t-shirt under {DEL}. " + CARA)
BANDA = (" Square composition: her face, both hands and the main balloon piece all sit inside the central horizontal band "
         "(the middle 55% of the height). The camera is far enough back that the top of her head is a full quarter of the "
         "image height below the top edge; the top quarter is only wall, the bottom fifth only table surface.")
CENTRO = " Wide 16:9 composition with the face, hands and main piece in the central two thirds of the frame."
BOMBA = ("a two-way hand balloon pump: a plain smooth plastic cylinder about 28 cm long, with a short tapered nozzle at its "
         "front end and, at its back end, a T-shaped handle on a thin rod that slides in and out of the cylinder")
PERRO = ("a classic balloon dog twisted from one long thin modelling balloon: snout bubble with the knot at the nose, two ear "
         "bubbles, a neck, two front legs, a body, two back legs and a short tail bubble")
TARRO = ("a tall plain white ceramic jar holding a dozen straight, fully inflated long thin modelling balloons in assorted "
         "vivid colors, standing up like sticks")

J = {
 'cover-globoflexia': ('1:1', 'caro', CAM + LUGAR + CARO +
    f"Waist-up, she sits at a light wood table in a sunny living room. Her right hand holds up, by its body, {PERRO}, in "
    f"turquoise. Her left hand rests flat on the table. On the table, a colorful spread of finished balloon twisting "
    f"figures: an orange balloon dog of the same shape, a pink balloon flower with a green stem, a yellow balloon sword and a "
    f"lilac balloon heart; {TARRO}; and {BOMBA}, lying on its side. No uninflated balloons anywhere." + MANOS + BANDA + NO),
 'cover-bouquets': ('1:1', 'vale', CAM + LUGAR + VALE +
    "Waist-up, she stands behind a white worktable in a bright home studio, finishing a compact tabletop helium balloon "
    "bouquet that stands on the table beside her: six round latex balloons (fuchsia, turquoise, sunny yellow, lilac, chrome "
    "gold, chrome rose gold) and one smooth gold foil star, floating low at staggered heights on short curled ribbons, about "
    "35 cm long, all tied to one small round balloon weight wrapped in fuchsia tissue that sits on a small white box on the "
    "table. The top balloon is no higher than her head and the weight is at the height of her waist. Her right hand gathers "
    "the ribbons a hand-width below the balloons; her left hand rests on the table next to the weight. On the table: three "
    "plain ribbon spools in fuchsia, turquoise and gold, small scissors. Behind her, shelves with clear unlabeled jars of "
    "balloons sorted by color." + MANOS + BANDA + NO),
 'cover-burbuja': ('1:1', 'jenny', CAM + LUGAR + JENNY +
    "Waist-up, she stands at a white worktable in a bright home studio, beside (not behind) a finished stuffed bubble "
    "balloon: one large crystal-clear 24-inch round bubble balloon, perfectly smooth, filled with many small 5-inch latex "
    "balloons in fuchsia, turquoise, yellow, orange, lilac and chrome gold plus a little metallic confetti, sitting on a "
    "short white cylindrical gift-box base decorated with a big fuchsia satin bow and a tail of paper tassels. The bubble is "
    "at the height of her face. Both her hands are below the bubble: the right hand steadies the white base, the left hand "
    "fluffs one loop of the satin bow; no arm passes behind the bubble. On the table: a white bowl of small inflated "
    "balloons, one ribbon spool, scissors." + MANOS + BANDA + NO),
 'decoracion-guirnalda': ('4:3', 'jenny', CAM + JENNY +
    "A simple, pretty event room with a smooth light wall, wood floor and a tall window on the left. A lush finished organic "
    "balloon garland with colors well mixed (never blocks of one color) and clearly different sizes (a few large 18-inch, "
    "many medium 11-inch and scattered small 5-inch balloons) sweeps in a wide asymmetric arc across the wall and down to "
    "the floor on the right, framing a dessert table with a white cloth, a cake on a stand and a small vase of flowers. She "
    "stands at the right of center, from mid-thigh up, pressing one small yellow balloon the size of an orange into a gap "
    "between larger balloons at shoulder height with her right hand; her left hand, down at her side, holds a small flat "
    "white roll of glue dots. No strip, line or frame visible; the garland fills most of the frame and stays inside it." +
    MANOS + " Horizontal 4:3 composition, the action near the center." + NO),
 'og-default': ('16:9', 'caro', CAM + CARO +
    "A simple, pretty event room with a smooth cream wall, pale wood floor and tall windows on the left. A full, finished "
    "organic balloon arch with colors well mixed and clearly different sizes rises from the floor on the left, curves over "
    "a dessert table with a white cloth and a cake on a stand, and comes down to the floor on the right, both ends inside "
    "the frame. She stands just right of center in front of the arch, from the knees up, reaching with her right hand to "
    "settle one turquoise balloon at shoulder height; her left arm hangs relaxed at her side. No frame, strip, tie or line "
    "visible anywhere on the arch; the wall is clean." + MANOS +
    " Wide 16:9 composition; the arch and the woman stay inside the central 85% of the height." + NO),
 'certificado-mockup': ('4:3', None, CAM + LUGAR +
    "Still life, no people. On a white table, a simple A-frame tabletop easel in light wood (two front legs, one back leg, "
    "one narrow ledge) holds one certificate in landscape format that fills almost half of the picture width: heavy cream "
    "cotton paper with a fine double gold-foil border and small corner ornaments, and one smooth plain round gold-foil "
    "sticker seal with a short raspberry-red ribbon at the lower right. The seal is a flat shiny disc with a scalloped edge "
    "and no relief, pattern or lettering. The sheet is otherwise completely blank. The certificate is centered, facing the "
    "camera almost straight on, in sharp focus. All balloons are air-filled and rest on the table or hang on the wall, none "
    "floats and there are no ribbons or strings: a cluster of chrome gold, rose gold, fuchsia, turquoise and sunny yellow "
    "balloons resting on the table at the left of the easel, a clear balloon with gold confetti and a smooth gold foil star "
    "resting on the table at the right, and a soft out-of-focus organic balloon garland on the wall behind. A few gold "
    "confetti dots on the table. The upper right and lower left corners of the frame stay simple. Horizontal 4:3." + NO),
 'arco-de-globos': ('16:9', 'vale', CAM + VALE +
    "A simple, pretty event room with light walls and wood floor. A freestanding rainbow-shaped balloon arch about two meters "
    "tall, both ends on the floor about two and a half meters apart, each end of its thin white rod planted in a round, "
    "flat, white water-filled base the size of a large pizza. The left two thirds of the arch are already covered with "
    "tight clusters of balloons in mixed colors and sizes; the right third still shows the bare thin white rod going down "
    "into its base. She stands at the right of center, from mid-thigh up, pressing one cluster of exactly four round 11-inch "
    "balloons (one fuchsia, one orange, one yellow, one turquoise, joined at their knots like a four-leaf clover) onto the "
    "bare rod, one hand on each side of the cluster, the rod passing through the center of the cluster. On the floor "
    "beside her, a low open cardboard box with more balloons." + MANOS + CENTRO + NO),
 'como-inflar-globos': ('16:9', 'vale', CAM + LUGAR + VALE +
    f"Waist-up, she stands at a light wood table inflating one round fuchsia 11-inch latex balloon with {BOMBA}. The "
    "balloon's neck is stretched over the front nozzle and pinched there by the thumb and index finger of her left hand; "
    "her right hand grips the T-handle at the back end, pulled halfway out. The balloon is two-thirds inflated and round. On "
    "the table: six inflated round balloons (turquoise, yellow, orange, lilac, chrome gold, chrome silver), one smooth, "
    "fully inflated gold foil star, and a small neat pile of flat uninflated round latex balloons in assorted colors." +
    MANOS + CENTRO + NO),
 'como-inflar-globos-largos': ('16:9', 'caro', CAM + LUGAR + CARO +
    f"Waist-up, she stands at a light wood table inflating one long thin orange modelling balloon with {BOMBA}. Her left hand "
    "pinches the balloon's open end on the front nozzle; her right hand grips the T-handle at the back end. The balloon "
    "extends to the left, straight and even, about 80 cm inflated; its far end is closed and rounded, and the last 8 cm "
    "beyond the inflated part are a thin, limp, uninflated tail of the same orange rubber, hanging down. On the table: "
    f"{TARRO}, and one finished small balloon dog in turquoise. No uninflated balloons on the table." + MANOS + CENTRO + NO),
 'como-inflar-un-globo-burbuja': ('16:9', 'jenny', CAM + LUGAR + JENNY +
    "Waist-up, she stands at a white worktable inflating a crystal-clear 24-inch bubble balloon. On the table sits a compact "
    "electric balloon inflator: a small smooth white box about the size of a toaster with two short conical nozzles pointing "
    "up on its top and a power cord going off the table. The bubble balloon stands above the inflator with its narrow neck "
    "fitted down over the left nozzle, pinched there by the thumb and index finger of her left hand; her right hand rests on "
    "the outside of the bubble, steadying it. The bubble is almost full and smooth, and inside it are seven small 5-inch "
    "latex balloons in fuchsia, turquoise, yellow and orange. On the table: a white bowl with more small inflated balloons, "
    "a small dish of metallic confetti, one ribbon spool." + MANOS + CENTRO + NO),
}
ED = "Edit this photo. Keep everything else exactly identical: the person, face, hands, clothes, lighting, colors and framing. Change only this: "
E = {
 'globoflexia': ('16:9', 'cand/globoflexia/r1_b.png', ED +
    "1) remove the short flat uninflated balloons from the table and put in their place four straight, fully inflated long "
    "thin modelling balloons in assorted colors lying side by side; 2) replace the unclear blue balloon figure on the right "
    "side of the table with a simple blue balloon sword (a straight blade with a small looped handle). No text anywhere."),
 'bouquet-de-globos': ('16:9', 'cand/bouquet-de-globos/r1_b.png', ED +
    "1) slide the gift box to the side so that one small round balloon weight wrapped in lilac tissue is clearly visible on "
    "the table directly under the bouquet, with all the ribbons of the balloons tied to it; 2) her right hand holds the "
    "ribbons together just above the weight and her left hand gently steadies one balloon of the bouquet. The card on the "
    "table stays completely blank. No text anywhere."),
 'cuanto-cobrar-por-decoracion-con-globos': ('16:9', 'cand/cuanto-cobrar-por-decoracion-con-globos/r1_b.png', ED +
    "1) the open notebook page shows only a light pencil sketch of a balloon arch and is otherwise blank, with no "
    "handwriting, no lines of scribbles, no numbers; 2) replace the three large deflated balloons in the foreground with a "
    "small neat pile of small flat uninflated round balloons. No text anywhere."),
 'tipos-y-tamanos-de-globos': ('16:9', 'cand/tipos-y-tamanos-de-globos/r1_a.png', ED.replace('the person, face, hands, clothes, ', '') +
    "1) replace the two long balloons twisted together like a rope with two separate straight, fully inflated long thin "
    "modelling balloons lying parallel; 2) remove the fingers visible behind or through the clear confetti bubble balloon, "
    "so that only the one hand holding the cardboard sizer remains; 3) each balloon in the row rests on exactly one low "
    "white ring; 4) the holes of the cardboard sizer are clean see-through circles with nothing stuck in them. No text anywhere."),
}
T = []
for k, (asp, quien, p) in J.items():
    for v in 'ab':
        T.append({'out': f'cand/{k}/r2_{v}.png', 'prompt': p, 'aspecto': asp, 'modelo': 'gemini-3-pro-image', 'tam': '2K',
                  'refs': (REFJ if quien == 'jenny' else [REF[quien]]) if quien else []})
for k, (asp, src, p) in E.items():
    T.append({'out': f'cand/{k}/r2_ed.png', 'prompt': p, 'aspecto': asp, 'modelo': 'gemini-3-pro-image', 'tam': '2K', 'refs': [src]})
if __name__ == '__main__':
    json.dump(T, open('trabajos/r2.json', 'w'), ensure_ascii=False, indent=1)
    print(len(T), 'trabajos')
