#!/usr/bin/env python3
"""
Simple script to create placeholder icons for the Chrome extension.
Requires PIL/Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not installed. Install with: pip install Pillow")
    exit(1)

def create_icon(size, filename):
    """Create a simple icon with the size specified"""
    # Create image with cream background
    img = Image.new('RGB', (size, size), color='#fefcf9')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple border
    border_color = '#3d3a35'
    draw.rectangle([0, 0, size-1, size-1], outline=border_color, width=max(1, size//16))
    
    # Draw a simple "IT" text or symbol for small sizes
    if size >= 48:
        try:
            # Try to use a font
            font_size = size // 3
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = "IT"
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center the text
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        
        draw.text((x, y), text, fill=border_color, font=font)
    else:
        # For small icons, just draw a simple shape
        center = size // 2
        radius = size // 4
        draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                    fill=border_color)
    
    img.save(filename)
    print(f"Created {filename} ({size}x{size})")

if __name__ == "__main__":
    print("Creating extension icons...")
    create_icon(16, "icon16.png")
    create_icon(48, "icon48.png")
    create_icon(128, "icon128.png")
    print("Done! Icons created successfully.")

