package graph

import "fmt"

// GLOBAL VARS IN RESOLVERS ARE NOT PERSISTENT, THUS THIS FILE EXISTS

var ErrInternal = fmt.Errorf("internal system error")
var ErrNotFound = fmt.Errorf("entity for resolution not found")
