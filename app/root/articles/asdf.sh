for a in `ls ./**/*.md.json`; do
  n="${a//.md/.html.md}"
  if [ -f $n ]; then
    echo "0$n"
  else
    mv $a $n
  fi
done
