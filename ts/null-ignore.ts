function liveDangerously(x?: number | undefined) {
  console.log(x!.toFixed())
}

liveDangerously(undefined);
