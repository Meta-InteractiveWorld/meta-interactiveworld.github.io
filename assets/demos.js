window.IW_DEMOS = {
  "opening": {
    "assistant": "Hi! What would you like me to help you with?"
  },
  "choices": [
    {
      "id": "meal",
      "text": "Help me plan my meals for today.",
      "demo": "meal"
    },
    {
      "id": "cook",
      "text": "Help me cook more dishes in less time.",
      "demo": "cook"
    },
    {
      "id": "watch",
      "text": "You don't need to do anything. Just watch over me and remind me when I make a mistake.",
      "demo": "watch"
    }
  ],
  "demos": {
    "meal": {
      "video": "media/meal_plan.mp4",
      "poster": "media/meal_plan_poster.jpg",
      "duration": 114.916,
      "speech": [
        {
          "id": "s0",
          "t": 0.25,
          "role": "assistant",
          "text": "No problem! First, let me know about your health and what ingredients you have."
        },
        {
          "id": "s1",
          "t": 4.25,
          "role": "human",
          "text": "Oh, right! My doctor gave me a daily nutrition plan. It's on my desk in the study."
        },
        {
          "id": "s2",
          "t": 17.833,
          "role": "human",
          "text": "This is my daily nutrition plan. I've already had about 450 calories at lunch, and that isn't on the sheet yet."
        },
        {
          "id": "s3",
          "t": 21.833,
          "role": "assistant",
          "text": "Got it. That leaves you about 900 calories for today. Now let me take a look at what ingredients you have."
        },
        {
          "id": "s4",
          "t": 25.833,
          "role": "human",
          "text": "Okay, let me go check the kitchen."
        },
        {
          "id": "s5",
          "t": 51.167,
          "role": "assistant",
          "text": "Here's my estimate: the apple is about 95 kcal, a bowl of cereal about 150, the salad about 150, the cola about 210 with 55 g of sugar, a slice of the cake about 350, and half of the leftover pizza about 600. With roughly 900 kcal left, I'd go for the salad, apple and cereal: around 400 kcal, plus the fiber you're still short on. If you're really hungry, half the pizza or a slice of cake still fits. Just skip the cola."
        },
        {
          "id": "s6",
          "t": 63.167,
          "role": "human",
          "text": "Okay, I'll take your advice: the salad, the apple and the cereal."
        }
      ],
      "segments": [
        {
          "id": "g0",
          "t": 4.0,
          "actions": [
            {
              "label": "[WALK] <plan>",
              "start": 4.0,
              "end": 12.417
            },
            {
              "label": "[LOOKAT] <plan>",
              "start": 12.417,
              "end": 17.583
            }
          ]
        },
        {
          "id": "g1",
          "t": 25.583,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 25.583,
              "end": 35.083
            },
            {
              "label": "[LOOKAT] <counter>",
              "start": 35.083,
              "end": 38.583
            },
            {
              "label": "[WALK] <fridge>",
              "start": 38.583,
              "end": 40.833
            },
            {
              "label": "[OPEN] <fridge>",
              "start": 40.833,
              "end": 47.417
            },
            {
              "label": "[LOOKAT] <fridge>",
              "start": 47.417,
              "end": 50.917
            }
          ]
        },
        {
          "id": "g2",
          "t": 62.917,
          "actions": [
            {
              "label": "[GRAB] <salad>",
              "start": 62.917,
              "end": 66.583
            },
            {
              "label": "[CLOSE] <fridge>",
              "start": 66.583,
              "end": 74.583
            },
            {
              "label": "[WALK] <table>",
              "start": 74.583,
              "end": 79.083
            },
            {
              "label": "[PUT] <salad> <table>",
              "start": 79.083,
              "end": 83.583
            },
            {
              "label": "[WALK] <counter>",
              "start": 83.583,
              "end": 87.417
            },
            {
              "label": "[GRAB] <apple>",
              "start": 87.417,
              "end": 90.25
            },
            {
              "label": "[WALK] <table>",
              "start": 90.25,
              "end": 93.333
            },
            {
              "label": "[PUT] <apple> <table>",
              "start": 93.333,
              "end": 97.667
            },
            {
              "label": "[WALK] <counter>",
              "start": 97.667,
              "end": 101.333
            },
            {
              "label": "[GRAB] <cereal>",
              "start": 101.333,
              "end": 105.0
            },
            {
              "label": "[WALK] <table>",
              "start": 105.0,
              "end": 109.0
            },
            {
              "label": "[PUT] <cereal> <table>",
              "start": 109.0,
              "end": 114.917
            }
          ]
        }
      ],
      "end": {
        "title": "Dinner Is on the Table",
        "body": "Salad, apple and cereal: about 400 kcal, well within the 900 kcal left for today."
      }
    },
    "cook": {
      "video": "media/cook_dinner.mp4",
      "poster": "media/cook_dinner_poster.jpg",
      "duration": 354.75,
      "speech": [
        {
          "id": "s0",
          "t": 0.25,
          "role": "assistant",
          "text": "Sure! What's the occasion, and what do you have to work with?"
        },
        {
          "id": "s1",
          "t": 4.25,
          "role": "human",
          "text": "I'm a total beginner in the kitchen. Four friends are coming over in twenty minutes. One is allergic to shellfish, one to nuts, and one can't have dairy. The oven is already preheating. Can you help me make three quick, safe dishes? Let me show you what I've got."
        },
        {
          "id": "s2",
          "t": 14.583,
          "role": "human",
          "text": "On the counter I've got broccolini and baby carrots, lemon slices, walnuts and peanut butter, plus olive oil, salt and a pepper grinder by the stove."
        },
        {
          "id": "s3",
          "t": 33.917,
          "role": "human",
          "text": "And in the fridge: two chicken cutlets, a trout, shrimp, crab, milk and cheese."
        },
        {
          "id": "s4",
          "t": 37.417,
          "role": "assistant",
          "text": "Here's a 20-minute plan with all three appliances running at once: chicken cutlets roasted in the oven at 220 \u00b0C for 15 minutes, broccolini and carrots steamed in the microwave for 6 minutes, and the trout pan-seared for about 8 minutes. Skip the shrimp, crab, walnuts, peanut butter, milk and cheese, and cook with olive oil. Start with the chicken: take the tray out, set it next to the stove, drizzle on some olive oil, then season with salt and pepper."
        },
        {
          "id": "s5",
          "t": 67.25,
          "role": "human",
          "text": "Okay: oil, salt, pepper."
        },
        {
          "id": "s6",
          "t": 102.417,
          "role": "assistant",
          "text": "Perfect. Now put the tray in the oven."
        },
        {
          "id": "s7",
          "t": 121.417,
          "role": "assistant",
          "text": "While that roasts, put the plate of vegetables in the microwave and start it for six minutes."
        },
        {
          "id": "s8",
          "t": 143.583,
          "role": "human",
          "text": "Okay, veggies are in."
        },
        {
          "id": "s9",
          "t": 150.25,
          "role": "assistant",
          "text": "Next, add a little olive oil to the pan and turn the burner to medium. Then slide the trout in and season it with salt and pepper."
        },
        {
          "id": "s10",
          "t": 218.167,
          "role": "human",
          "text": "Fish is sizzling."
        },
        {
          "id": "s11",
          "t": 224.167,
          "role": "assistant",
          "text": "Everything's cooking now. The vegetables will be done first."
        },
        {
          "id": "s12",
          "t": 231.417,
          "role": "assistant",
          "text": "The microwave's done. Take the vegetables out to the table."
        },
        {
          "id": "s13",
          "t": 254.083,
          "role": "human",
          "text": "Veggies are on the table."
        },
        {
          "id": "s14",
          "t": 257.333,
          "role": "assistant",
          "text": "The trout is golden. Turn off the heat, slide it onto the plate, and add the lemon slices beside it."
        },
        {
          "id": "s15",
          "t": 303.083,
          "role": "human",
          "text": "That looks great!"
        },
        {
          "id": "s16",
          "t": 306.333,
          "role": "assistant",
          "text": "The chicken's ready. Take the tray out and slide the cutlets onto the plate next to the oven."
        },
        {
          "id": "s17",
          "t": 310.25,
          "role": "human",
          "text": "On it."
        },
        {
          "id": "s18",
          "t": 347.0,
          "role": "human",
          "text": "Done in eighteen minutes, and nothing anyone's allergic to!"
        },
        {
          "id": "s19",
          "t": 351.0,
          "role": "assistant",
          "text": "Perfect timing. Enjoy dinner with your friends!"
        }
      ],
      "segments": [
        {
          "id": "g0",
          "t": 11.0,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 11.0,
              "end": 14.333
            },
            {
              "label": "[LOOKAT] <counter>",
              "start": 14.333,
              "end": 17.833
            },
            {
              "label": "[WALK] <fridge>",
              "start": 24.833,
              "end": 27.083
            },
            {
              "label": "[OPEN] <fridge>",
              "start": 27.083,
              "end": 33.667
            },
            {
              "label": "[LOOKAT] <fridge>",
              "start": 33.667,
              "end": 37.167
            }
          ]
        },
        {
          "id": "g1",
          "t": 51.167,
          "actions": [
            {
              "label": "[GRAB] <tray>",
              "start": 51.167,
              "end": 55.083
            },
            {
              "label": "[CLOSE] <fridge>",
              "start": 55.083,
              "end": 63.083
            },
            {
              "label": "[WALK] <counter>",
              "start": 63.083,
              "end": 63.75
            },
            {
              "label": "[PUT] <tray> <counter>",
              "start": 63.75,
              "end": 67.0
            },
            {
              "label": "[GRAB] <olive oil>",
              "start": 67.0,
              "end": 72.75
            },
            {
              "label": "[POUR] <tray> <olive oil>",
              "start": 72.75,
              "end": 76.917
            },
            {
              "label": "[PUT] <olive oil> <counter>",
              "start": 76.917,
              "end": 80.167
            },
            {
              "label": "[GRAB] <salt>",
              "start": 80.167,
              "end": 84.167
            },
            {
              "label": "[POUR] <tray> <salt>",
              "start": 84.167,
              "end": 88.333
            },
            {
              "label": "[PUT] <salt> <counter>",
              "start": 88.333,
              "end": 91.583
            },
            {
              "label": "[GRAB] <pepper>",
              "start": 91.583,
              "end": 94.75
            },
            {
              "label": "[POUR] <tray> <pepper>",
              "start": 94.75,
              "end": 98.917
            },
            {
              "label": "[PUT] <pepper> <counter>",
              "start": 98.917,
              "end": 102.167
            }
          ]
        },
        {
          "id": "g2",
          "t": 102.167,
          "actions": [
            {
              "label": "[GRAB] <tray>",
              "start": 102.167,
              "end": 105.0
            },
            {
              "label": "[WALK] <oven>",
              "start": 105.0,
              "end": 106.5
            },
            {
              "label": "[OPEN] <oven>",
              "start": 106.5,
              "end": 112.417
            },
            {
              "label": "[PUTINSIDE] <tray> <oven>",
              "start": 112.417,
              "end": 115.25
            },
            {
              "label": "[CLOSE] <oven>",
              "start": 115.25,
              "end": 121.167
            }
          ]
        },
        {
          "id": "g3",
          "t": 121.167,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 121.167,
              "end": 123.0
            },
            {
              "label": "[GRAB] <vegetables>",
              "start": 123.0,
              "end": 126.167
            },
            {
              "label": "[WALK] <microwave>",
              "start": 126.167,
              "end": 128.083
            },
            {
              "label": "[OPEN] <microwave>",
              "start": 128.083,
              "end": 134.0
            },
            {
              "label": "[PUTINSIDE] <vegetables> <microwave>",
              "start": 134.0,
              "end": 137.417
            },
            {
              "label": "[CLOSE] <microwave>",
              "start": 137.417,
              "end": 143.333
            },
            {
              "label": "[TURNON] <microwave>",
              "start": 143.333,
              "end": 150.0
            }
          ]
        },
        {
          "id": "g4",
          "t": 150.0,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 150.0,
              "end": 151.167
            },
            {
              "label": "[GRAB] <olive oil>",
              "start": 151.167,
              "end": 154.0
            },
            {
              "label": "[POUR] <pan> <olive oil>",
              "start": 154.0,
              "end": 158.5
            },
            {
              "label": "[PUT] <olive oil> <counter>",
              "start": 158.5,
              "end": 161.75
            },
            {
              "label": "[TURNON] <burner>",
              "start": 161.75,
              "end": 172.167
            },
            {
              "label": "[WALK] <fridge>",
              "start": 172.167,
              "end": 175.667
            },
            {
              "label": "[OPEN] <fridge>",
              "start": 175.667,
              "end": 182.25
            },
            {
              "label": "[GRAB] <trout>",
              "start": 182.25,
              "end": 185.833
            },
            {
              "label": "[CLOSE] <fridge>",
              "start": 185.833,
              "end": 193.833
            },
            {
              "label": "[WALK] <counter>",
              "start": 193.833,
              "end": 194.583
            },
            {
              "label": "[POUR] <pan> <trout>",
              "start": 194.583,
              "end": 199.667
            },
            {
              "label": "[PUT] <trout> <counter>",
              "start": 199.667,
              "end": 203.25
            },
            {
              "label": "[GRAB] <salt>",
              "start": 203.25,
              "end": 206.083
            },
            {
              "label": "[POUR] <trout> <salt>",
              "start": 206.083,
              "end": 211.833
            },
            {
              "label": "[PUT] <salt> <counter>",
              "start": 211.833,
              "end": 215.083
            },
            {
              "label": "[GRAB] <pepper>",
              "start": 215.083,
              "end": 217.917
            },
            {
              "label": "[POUR] <trout> <pepper>",
              "start": 217.917,
              "end": 223.917
            },
            {
              "label": "[PUT] <pepper> <counter>",
              "start": 223.917,
              "end": 227.167
            }
          ]
        },
        {
          "id": "g5",
          "t": 231.167,
          "actions": [
            {
              "label": "[WALK] <microwave>",
              "start": 231.167,
              "end": 232.833
            },
            {
              "label": "[OPEN] <microwave>",
              "start": 232.833,
              "end": 239.417
            },
            {
              "label": "[GRAB] <vegetables>",
              "start": 239.417,
              "end": 243.083
            },
            {
              "label": "[CLOSE] <microwave>",
              "start": 243.083,
              "end": 249.0
            },
            {
              "label": "[WALK] <table>",
              "start": 249.0,
              "end": 253.833
            },
            {
              "label": "[PUT] <vegetables> <table>",
              "start": 253.833,
              "end": 257.083
            }
          ]
        },
        {
          "id": "g6",
          "t": 257.083,
          "actions": [
            {
              "label": "[WALK] <burner>",
              "start": 257.083,
              "end": 260.167
            },
            {
              "label": "[TURNOFF] <burner>",
              "start": 260.167,
              "end": 265.583
            },
            {
              "label": "[GRAB] <pan>",
              "start": 265.583,
              "end": 268.75
            },
            {
              "label": "[POUR] <plate> <pan>",
              "start": 268.75,
              "end": 273.333
            },
            {
              "label": "[PUT] <pan> <burner>",
              "start": 273.333,
              "end": 278.917
            },
            {
              "label": "[GRAB] <lemon>",
              "start": 278.917,
              "end": 285.417
            },
            {
              "label": "[POUR] <plate> <lemon>",
              "start": 285.417,
              "end": 291.167
            },
            {
              "label": "[PUT] <lemon> <counter>",
              "start": 291.167,
              "end": 294.75
            },
            {
              "label": "[GRAB] <plate>",
              "start": 294.75,
              "end": 301.5
            },
            {
              "label": "[WALK] <table>",
              "start": 301.5,
              "end": 302.833
            },
            {
              "label": "[PUT] <plate> <table>",
              "start": 302.833,
              "end": 306.083
            }
          ]
        },
        {
          "id": "g7",
          "t": 306.083,
          "actions": [
            {
              "label": "[WALK] <oven>",
              "start": 306.083,
              "end": 310.0
            },
            {
              "label": "[OPEN] <oven>",
              "start": 310.0,
              "end": 316.583
            },
            {
              "label": "[GRAB] <tray>",
              "start": 316.583,
              "end": 319.75
            },
            {
              "label": "[POUR] <plate> <tray>",
              "start": 319.75,
              "end": 325.5
            },
            {
              "label": "[PUTINSIDE] <tray> <oven>",
              "start": 325.5,
              "end": 329.667
            },
            {
              "label": "[CLOSE] <oven>",
              "start": 329.667,
              "end": 335.583
            },
            {
              "label": "[GRAB] <plate>",
              "start": 335.583,
              "end": 339.667
            },
            {
              "label": "[WALK] <table>",
              "start": 339.667,
              "end": 343.5
            },
            {
              "label": "[PUT] <plate> <table>",
              "start": 343.5,
              "end": 346.75
            }
          ]
        }
      ],
      "end": {
        "title": "Dinner for Four, Ready in 18 Minutes",
        "body": "Roast chicken, pan-seared trout with lemon, and steamed vegetables: no shellfish, no nuts, no dairy."
      },
      "clock": {
        "limit": 1200,
        "keys": [
          [
            0.0,
            0
          ],
          [
            51.167,
            60
          ],
          [
            102.167,
            130
          ],
          [
            121.167,
            150
          ],
          [
            150.0,
            210
          ],
          [
            227.167,
            300
          ],
          [
            227.167,
            300
          ],
          [
            231.167,
            570
          ],
          [
            257.083,
            630
          ],
          [
            257.083,
            750
          ],
          [
            306.083,
            840
          ],
          [
            306.083,
            990
          ],
          [
            346.75,
            1080
          ]
        ],
        "show": 6.0
      },
      "appliances": [
        {
          "id": "oven",
          "label": "Oven",
          "events": [
            {
              "t": 0.0,
              "state": "on",
              "text": "Preheating to 220 \u00b0C",
              "until": null
            },
            {
              "t": 121.167,
              "state": "on",
              "text": "220 \u00b0C \u00b7 chicken",
              "until": 990
            },
            {
              "t": 306.083,
              "state": "done",
              "text": "Chicken ready",
              "until": null
            },
            {
              "t": 335.583,
              "state": "off",
              "text": "Off",
              "until": null
            }
          ]
        },
        {
          "id": "microwave",
          "label": "Microwave",
          "events": [
            {
              "t": 150.0,
              "state": "on",
              "text": "Vegetables",
              "until": 570
            },
            {
              "t": 231.167,
              "state": "done",
              "text": "Done",
              "until": null
            },
            {
              "t": 239.417,
              "state": "off",
              "text": "Off",
              "until": null
            }
          ]
        },
        {
          "id": "stove",
          "label": "Stove",
          "events": [
            {
              "t": 172.167,
              "state": "on",
              "text": "Medium heat",
              "until": null
            },
            {
              "t": 199.667,
              "state": "on",
              "text": "Trout searing",
              "until": 750
            },
            {
              "t": 257.083,
              "state": "done",
              "text": "Trout golden",
              "until": null
            },
            {
              "t": 265.583,
              "state": "off",
              "text": "Off",
              "until": null
            }
          ]
        }
      ],
      "avoid": {
        "t": 37.167,
        "items": [
          {
            "group": "Shellfish",
            "foods": "shrimp, crab"
          },
          {
            "group": "Nuts",
            "foods": "walnuts, peanut butter"
          },
          {
            "group": "Dairy",
            "foods": "milk, cheese"
          }
        ]
      }
    },
    "watch": {
      "video": "media/watch_over_me.mp4",
      "poster": "media/watch_over_me_poster.jpg",
      "duration": 272.25,
      "speech": [
        {
          "id": "s0",
          "t": 0.25,
          "role": "assistant",
          "text": "Sure. I'll keep an eye on things and only speak up when something needs your attention."
        },
        {
          "id": "s1",
          "t": 4.25,
          "role": "human",
          "text": "Perfect. I have a client meeting at nine and I'm already behind. Shirt, breakfast, pills, then out the door."
        },
        {
          "id": "s2",
          "t": 24.917,
          "role": "human",
          "text": "Just the front and the collar. Nobody looks at the back."
        },
        {
          "id": "s3",
          "t": 66.333,
          "role": "human",
          "text": "One slice of toast. That counts as breakfast."
        },
        {
          "id": "s4",
          "t": 69.333,
          "role": "human",
          "text": "Oh, that's my phone. Probably Mark, about the slides."
        },
        {
          "id": "s5",
          "t": 78.583,
          "role": "human",
          "text": "Hi Mark. Yes, I updated the numbers last night."
        },
        {
          "id": "s6",
          "t": 84.583,
          "role": "human",
          "text": "No, slide twelve, the one with the chart\u2014"
        },
        {
          "id": "s7",
          "t": 90.583,
          "role": "assistant",
          "text": "Sorry to interrupt, but your bread is still on the stove. The burner's been on for four minutes and nobody's in the kitchen.",
          "alert": "danger"
        },
        {
          "id": "s8",
          "t": 96.583,
          "role": "human",
          "text": "Oh no! Mark, I'll call you right back."
        },
        {
          "id": "s9",
          "t": 127.25,
          "role": "human",
          "text": "Phew, just in time."
        },
        {
          "id": "s10",
          "t": 140.25,
          "role": "assistant",
          "text": "Before you go: your blood-pressure pill. You usually take it after breakfast. It's on the counter by the fridge.",
          "alert": "reminder"
        },
        {
          "id": "s11",
          "t": 145.25,
          "role": "human",
          "text": "Right, thank you."
        },
        {
          "id": "s12",
          "t": 175.75,
          "role": "human",
          "text": "One tablet, with water. Done."
        },
        {
          "id": "s13",
          "t": 189.417,
          "role": "human",
          "text": "Bag. Okay, I'm out."
        },
        {
          "id": "s14",
          "t": 194.5,
          "role": "assistant",
          "text": "Wait, your keys and phone are still on the side table in the living room. You put the phone down there after the call.",
          "alert": "reminder"
        },
        {
          "id": "s15",
          "t": 199.5,
          "role": "assistant",
          "text": "And the iron is still on. You left it on the ironing board.",
          "alert": "danger"
        },
        {
          "id": "s16",
          "t": 203.5,
          "role": "human",
          "text": "Seriously? I would have walked out with the iron on. Thanks."
        },
        {
          "id": "s17",
          "t": 263.5,
          "role": "assistant",
          "text": "Iron off, stove off, pill taken, keys and phone in your bag. You'll still make it by nine."
        },
        {
          "id": "s18",
          "t": 268.5,
          "role": "human",
          "text": "You're a lifesaver. See you later!"
        }
      ],
      "segments": [
        {
          "id": "g0",
          "t": 10.0,
          "actions": [
            {
              "label": "[WALK] <ironing board>",
              "start": 10.0,
              "end": 14.25
            },
            {
              "label": "[TURNON] <iron>",
              "start": 14.25,
              "end": 21.833
            },
            {
              "label": "[GRAB] <iron>",
              "start": 21.833,
              "end": 24.667
            },
            {
              "label": "[WIPE] <iron> <shirt>",
              "start": 24.667,
              "end": 32.833
            },
            {
              "label": "[PUT] <iron> <ironing board>",
              "start": 32.833,
              "end": 37.75
            }
          ]
        },
        {
          "id": "g1",
          "t": 37.75,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 37.75,
              "end": 43.417
            },
            {
              "label": "[GRAB] <plate>",
              "start": 43.417,
              "end": 46.583
            },
            {
              "label": "[POUR] <pan> <plate>",
              "start": 46.583,
              "end": 52.917
            },
            {
              "label": "[PUT] <plate> <counter>",
              "start": 52.917,
              "end": 56.167
            },
            {
              "label": "[TURNON] <burner>",
              "start": 56.167,
              "end": 66.083
            }
          ]
        },
        {
          "id": "g2",
          "t": 69.083,
          "actions": [
            {
              "label": "[WALK] <side table>",
              "start": 69.083,
              "end": 72.417
            },
            {
              "label": "[GRAB] <phone>",
              "start": 72.417,
              "end": 75.25
            },
            {
              "label": "[ANSWERPHONE] <phone>",
              "start": 75.25,
              "end": 78.333
            },
            {
              "label": "[PUT] <phone> <side table>",
              "start": 96.333,
              "end": 101.75
            }
          ]
        },
        {
          "id": "g3",
          "t": 101.75,
          "actions": [
            {
              "label": "[WALK] <burner>",
              "start": 101.75,
              "end": 105.833
            },
            {
              "label": "[TURNOFF] <burner>",
              "start": 105.833,
              "end": 111.25
            },
            {
              "label": "[GRAB] <pan>",
              "start": 111.25,
              "end": 114.417
            },
            {
              "label": "[POUR] <plate> <pan>",
              "start": 114.417,
              "end": 121.5
            },
            {
              "label": "[PUT] <pan> <burner>",
              "start": 121.5,
              "end": 127.0
            },
            {
              "label": "[GRAB] <toast>",
              "start": 127.0,
              "end": 132.417
            },
            {
              "label": "[PUT] <toast> <plate>",
              "start": 136.75,
              "end": 140.0
            }
          ]
        },
        {
          "id": "g4",
          "t": 145.0,
          "actions": [
            {
              "label": "[WALK] <counter>",
              "start": 145.0,
              "end": 147.5
            },
            {
              "label": "[LOOKAT] <pill bottle>",
              "start": 147.5,
              "end": 151.0
            },
            {
              "label": "[GRAB] <pill bottle>",
              "start": 151.0,
              "end": 154.167
            },
            {
              "label": "[POUR] <cup> <pill bottle>",
              "start": 154.167,
              "end": 158.333
            },
            {
              "label": "[PUT] <pill bottle> <counter>",
              "start": 158.333,
              "end": 161.583
            },
            {
              "label": "[GRAB] <cup>",
              "start": 161.583,
              "end": 164.417
            },
            {
              "label": "[PUT] <cup> <counter>",
              "start": 166.75,
              "end": 170.0
            },
            {
              "label": "[GRAB] <water>",
              "start": 170.0,
              "end": 173.167
            },
            {
              "label": "[PUT] <water> <counter>",
              "start": 177.5,
              "end": 180.75
            }
          ]
        },
        {
          "id": "g5",
          "t": 180.75,
          "actions": [
            {
              "label": "[WALK] <entry table>",
              "start": 180.75,
              "end": 189.167
            },
            {
              "label": "[GRAB] <bag>",
              "start": 189.167,
              "end": 193.667
            },
            {
              "label": "[TURNRIGHT] 72\u00b0",
              "start": 193.667,
              "end": 194.25
            }
          ]
        },
        {
          "id": "g6",
          "t": 206.25,
          "actions": [
            {
              "label": "[WALK] <side table>",
              "start": 206.25,
              "end": 214.667
            },
            {
              "label": "[PUT] <bag> <side table>",
              "start": 214.667,
              "end": 218.75
            },
            {
              "label": "[GRAB] <keys>",
              "start": 218.75,
              "end": 223.5
            },
            {
              "label": "[PUT] <keys> <bag>",
              "start": 223.5,
              "end": 227.583
            },
            {
              "label": "[GRAB] <phone>",
              "start": 227.583,
              "end": 230.417
            },
            {
              "label": "[PUT] <phone> <bag>",
              "start": 230.417,
              "end": 233.667
            },
            {
              "label": "[TURNOFF] <iron>",
              "start": 233.667,
              "end": 245.75
            },
            {
              "label": "[GRAB] <bag>",
              "start": 245.75,
              "end": 252.833
            },
            {
              "label": "[WALK] <entry table>",
              "start": 252.833,
              "end": 262.417
            },
            {
              "label": "[TURNRIGHT] 97\u00b0",
              "start": 262.417,
              "end": 263.25
            }
          ]
        }
      ],
      "end": {
        "title": "Out the Door, Nothing Left Behind",
        "body": "Stove off, iron off, pill taken, keys and phone in the bag, with an hour to spare before the 9:00 meeting."
      },
      "actingText": "Getting ready",
      "watchTitle": "Keeping an eye on",
      "clock": {
        "limit": 4800,
        "keys": [
          [
            0.0,
            0
          ],
          [
            37.75,
            240
          ],
          [
            66.083,
            300
          ],
          [
            78.333,
            330
          ],
          [
            90.333,
            540
          ],
          [
            101.75,
            560
          ],
          [
            127.0,
            620
          ],
          [
            145.0,
            700
          ],
          [
            180.75,
            800
          ],
          [
            194.25,
            900
          ],
          [
            206.25,
            920
          ],
          [
            263.25,
            1080
          ],
          [
            272.25,
            1110
          ]
        ],
        "show": 6.0,
        "wall": 27600,
        "label": "Morning",
        "limitText": "Meeting 9:00"
      },
      "appliances": [
        {
          "id": "iron",
          "label": "Iron",
          "events": [
            {
              "t": 0.0,
              "state": "off",
              "text": "Off",
              "until": null
            },
            {
              "t": 21.833,
              "state": "on",
              "text": "On, heating",
              "until": null
            },
            {
              "t": 37.75,
              "state": "on",
              "text": "On, on the board",
              "until": null
            },
            {
              "t": 199.25,
              "state": "warn",
              "text": "Still on, nobody there",
              "until": null
            },
            {
              "t": 245.75,
              "state": "off",
              "text": "Off",
              "until": null
            }
          ]
        },
        {
          "id": "stove",
          "label": "Stove",
          "events": [
            {
              "t": 0.0,
              "state": "off",
              "text": "Off",
              "until": null
            },
            {
              "t": 66.083,
              "state": "on",
              "text": "Bread frying",
              "until": null
            },
            {
              "t": 90.333,
              "state": "warn",
              "text": "On 4 min, nobody there",
              "until": null
            },
            {
              "t": 111.25,
              "state": "off",
              "text": "Off",
              "until": null
            }
          ]
        },
        {
          "id": "pill",
          "label": "Morning pill",
          "events": [
            {
              "t": 0.0,
              "state": "idle",
              "text": "Not taken yet",
              "until": null
            },
            {
              "t": 140.0,
              "state": "note",
              "text": "Due after breakfast",
              "until": null
            },
            {
              "t": 166.75,
              "state": "done",
              "text": "Taken at 7:53",
              "until": null
            }
          ]
        },
        {
          "id": "keys",
          "label": "Keys",
          "events": [
            {
              "t": 0.0,
              "state": "idle",
              "text": "Side table",
              "until": null
            },
            {
              "t": 194.25,
              "state": "note",
              "text": "Left on the side table",
              "until": null
            },
            {
              "t": 227.583,
              "state": "done",
              "text": "In your bag",
              "until": null
            }
          ]
        },
        {
          "id": "phone",
          "label": "Phone",
          "events": [
            {
              "t": 0.0,
              "state": "idle",
              "text": "Side table",
              "until": null
            },
            {
              "t": 75.25,
              "state": "idle",
              "text": "In your hand",
              "until": null
            },
            {
              "t": 101.75,
              "state": "idle",
              "text": "Side table",
              "until": null
            },
            {
              "t": 194.25,
              "state": "note",
              "text": "Left on the side table",
              "until": null
            },
            {
              "t": 233.667,
              "state": "done",
              "text": "In your bag",
              "until": null
            }
          ]
        }
      ]
    }
  }
};
