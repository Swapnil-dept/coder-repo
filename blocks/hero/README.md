
    # Hero

    The Hero block displays a prominent image with overlaying text and an optional call-to-action. It supports different layouts via variants.

    ## Image Analysis
    The block presents a two-column layout with an image and text content.
    **Variant: `image-right-text-left`**
    *   **Layout:** Two-column layout. Left column for text content, right column for image.
    *   **Content:**
        *   **Left Column:**
            *   Heading: "Take our super quiz" (h2)
            *   Description: "Do you know where you're at with your super? Before working out your next steps, you need to know where you're starting from." (p)
            *   CTA: "Take our quiz →" (button)
        *   **Right Column:**
            *   Image: A person working on a laptop.
            *   Overlay: A pink dotted circle graphic.
    *   **Styling:**
        *   Overall container: Rounded corners, light peach background.
        *   Text: Dark green heading, grey body text.
        *   CTA: Bordered button, white background, dark green text, arrow icon.
        *   Image: Rounded corners, with a pink dotted circle overlay.

    **Variant: `image-left-text-right`**
    *   **Layout:** Two-column layout. Left column for image, right column for text content.
    *   **Content:**
        *   **Left Column:**
            *   Image: A woman and a girl looking at building blocks.
            *   Overlay: A light green dotted circle graphic.
        *   **Right Column:**
            *   Heading: "Why choose NGS?" (h2)
            *   Description: "We are the leading industry super fund for those in the education and community sectors, but we're open to everyone. We're proud to offer competitive fees, award-winning insurance and strong investment returns. All our profits go back to our members — everything we do is about creating a brighter future for you." (p)
            *   CTA: "Find out more →" (button)
    *   **Styling:**
        *   Overall container: Rounded corners, light green background.
        *   Text: Dark green heading, grey body text.
        *   CTA: Bordered button, white background, dark green text, arrow icon.
        *   Image: Rounded corners, with a light green dotted circle overlay.

    ## Content

    ### Default (Full Width)
    ```json
    {
      "classes": "",
      "backgroundColor": "#f0f0f0",
      "image": "https://www.adobe.com/content/dam/cc/us/en/creative-cloud/photography/discover/landscape-photography/desktop/landscape_photography_P3_720x520.jpg",
      "imageAlt": "Scenic landscape",
      "text": "<h1>Welcome to our site!</h1><p>Discover amazing content and services.</p>",
      "cta": "https://www.adobe.com/creativecloud.html",
      "ctaText": "Learn More"
    }
    ```

    ### Image Right, Text Left
    ```json
    {
      "classes": "image-right-text-left",
      "backgroundColor": "rgb(250, 245, 242)",
      "image": "https://www.aem.live/media_11721596182590212.jpeg",
      "imageAlt": "Person working on a laptop",
      "text": "<h2>Take our super quiz</h2><p>Do you know where you're at with your super? Before working out your next steps, you need to know where you're starting from.</p>",
      "cta": "https://www.aem.live/quiz",
      "ctaText": "Take our quiz"
    }
    ```

    ### Image Left, Text Right
    ```json
    {
      "classes": "image-left-text-right",
      "backgroundColor": "rgb(237, 247, 244)",
      "image": "https://www.aem.live/media_11721596182590212.jpeg",
      "imageAlt": "Woman and girl looking at building blocks",
      "text": "<h2>Why choose NGS?</h2><p>We are the leading industry super fund for those in the <em>education and community sectors</em>, but we're open to everyone. We're proud to offer competitive fees, award-winning insurance and strong investment returns. All our profits go back to our members — everything we do is about creating a brighter future for you.</p>",
      "cta": "https://www.aem.live/about",
      "ctaText": "Find out more"
    }
    ```

| hero |
| --- |
| #f0f0f0 |
| https://www.adobe.com/content/dam/cc/us/en/creative-cloud/photography/discover/landscape-photography/desktop/landscape_photography_P3_720x520.jpg |
| Welcome to our site! Discover amazing content and services. |
| [Learn More](https://www.adobe.com/creativecloud.html) |


