# Troubleshooting

## “node is not recognized”
Install Node.js LTS, close VS Code, reopen it, and run setup again.

## Build stopped because a file is missing
Read the reported page and expected filename. Correct the spelling or add the file inside `source`, then rebuild.

## A direct-open feature behaves differently
Use `OPEN WEBSITE.bat`. Some browser security rules are stricter for `file://` pages than for a normal website.

## A manual change disappeared
It was probably made only inside `website`. Make the same change in the matching `source` file because `website` is recreated each time.

## GitHub build failed
Open the failed Actions run, expand the Build step, and read the same clear check message produced locally.

## Text becomes difficult to read on hover

Do not use a custom CSS compressor that removes ordinary spaces from selectors. Spaces can mean “an element inside another element.” Run `UPDATE WEBSITE.bat`; the supplied build system preserves selector whitespace safely.

## YouTube lessons appear blank

Run `UPDATE WEBSITE.bat` and confirm that `source/data/testimonials.json` exists. The checker now stops the build if that data file is missing or empty. The YouTube renderer also continues safely if testimonial data is unavailable.

