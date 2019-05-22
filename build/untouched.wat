(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/env/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 8) "\0e\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s\00")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (global $~lib/memory/HEAP_BASE i32 (i32.const 40))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "levenshtein" (func $assembly/index/levenshtein))
 (export "memory.compare" (func $~lib/memory/memory.compare))
 (export "memory.allocate" (func $~lib/memory/memory.allocate))
 (export "memory.free" (func $~lib/memory/memory.free))
 (export "memory.reset" (func $~lib/memory/memory.reset))
 (start $start)
 (func $start:~lib/allocator/arena (; 1 ;) (type $FUNCSIG$v)
  global.get $~lib/memory/HEAP_BASE
  i32.const 7
  i32.add
  i32.const 7
  i32.const -1
  i32.xor
  i32.and
  global.set $~lib/allocator/arena/startOffset
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $start:assembly/index (; 2 ;) (type $FUNCSIG$v)
  call $start:~lib/allocator/arena
 )
 (func $~lib/string/String#charCodeAt (; 3 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.const 0
  i32.ne
  i32.eqz
  if
   i32.const 0
   i32.const 8
   i32.const 75
   i32.const 4
   call $~lib/env/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.load
  i32.ge_u
  if
   i32.const -1
   return
  end
  local.get $0
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.load16_u offset=4
 )
 (func $~lib/allocator/arena/__memory_allocate (; 4 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741824
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/allocator/arena/offset
  local.set $1
  local.get $1
  local.get $0
  local.tee $2
  i32.const 1
  local.tee $3
  local.get $2
  local.get $3
  i32.gt_u
  select
  i32.add
  i32.const 7
  i32.add
  i32.const 7
  i32.const -1
  i32.xor
  i32.and
  local.set $4
  current_memory
  local.set $5
  local.get $4
  local.get $5
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $4
   local.get $1
   i32.sub
   i32.const 65535
   i32.add
   i32.const 65535
   i32.const -1
   i32.xor
   i32.and
   i32.const 16
   i32.shr_u
   local.set $2
   local.get $5
   local.tee $3
   local.get $2
   local.tee $6
   local.get $3
   local.get $6
   i32.gt_s
   select
   local.set $3
   local.get $3
   grow_memory
   i32.const 0
   i32.lt_s
   if
    local.get $2
    grow_memory
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $4
  global.set $~lib/allocator/arena/offset
  local.get $1
 )
 (func $assembly/index/min (; 5 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  local.get $0
  local.get $1
  i32.lt_u
  local.tee $5
  if (result i32)
   local.get $5
  else   
   local.get $2
   local.get $1
   i32.lt_u
  end
  if (result i32)
   local.get $0
   local.get $2
   i32.gt_u
   if (result i32)
    local.get $2
    i32.const 1
    i32.add
   else    
    local.get $0
    i32.const 1
    i32.add
   end
  else   
   local.get $3
   local.get $4
   i32.eq
   if (result i32)
    local.get $1
   else    
    local.get $1
    i32.const 1
    i32.add
   end
  end
 )
 (func $~lib/allocator/arena/__memory_free (; 6 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $assembly/index/levenshtein (; 7 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 0
   return
  end
  local.get $0
  i32.load
  local.set $2
  local.get $1
  i32.load
  local.set $3
  block $break|0
   loop $continue|0
    local.get $2
    i32.const 0
    i32.gt_u
    local.tee $4
    if (result i32)
     local.get $0
     local.get $2
     i32.const 1
     i32.sub
     call $~lib/string/String#charCodeAt
     local.get $1
     local.get $3
     i32.const 1
     i32.sub
     call $~lib/string/String#charCodeAt
     i32.eq
    else     
     local.get $4
    end
    if
     block
      local.get $2
      i32.const 1
      i32.sub
      local.set $2
      local.get $3
      i32.const 1
      i32.sub
      local.set $3
     end
     br $continue|0
    end
   end
  end
  i32.const 0
  local.set $4
  block $break|1
   loop $continue|1
    local.get $4
    local.get $2
    i32.lt_u
    local.tee $5
    if (result i32)
     local.get $0
     local.get $4
     call $~lib/string/String#charCodeAt
     local.get $1
     local.get $4
     call $~lib/string/String#charCodeAt
     i32.eq
    else     
     local.get $5
    end
    if
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $continue|1
    end
   end
  end
  local.get $2
  local.get $4
  i32.sub
  local.set $2
  local.get $3
  local.get $4
  i32.sub
  local.set $3
  local.get $2
  i32.const 0
  i32.eq
  local.tee $5
  if (result i32)
   local.get $5
  else   
   local.get $3
   i32.const 3
   i32.lt_u
  end
  if
   local.get $3
   return
  end
  i32.const 0
  local.set $5
  i32.const 0
  local.set $6
  local.get $2
  local.get $6
  i32.sub
  i32.const 2
  i32.mul
  local.set $18
  block $~lib/memory/memory.allocate|inlined.0 (result i32)
   local.get $18
   local.set $19
   local.get $19
   call $~lib/allocator/arena/__memory_allocate
   br $~lib/memory/memory.allocate|inlined.0
  end
  local.set $19
  i32.const 0
  local.set $20
  block $break|2
   loop $continue|2
    local.get $20
    local.get $18
    i32.lt_u
    if
     block
      local.get $19
      block (result i32)
       local.get $20
       local.tee $21
       i32.const 1
       i32.add
       local.set $20
       local.get $21
      end
      i32.const 65535
      i32.and
      i32.add
      local.get $6
      i32.const 1
      i32.add
      i32.store16
      local.get $19
      block (result i32)
       local.get $20
       local.tee $21
       i32.const 1
       i32.add
       local.set $20
       local.get $21
      end
      i32.const 65535
      i32.and
      i32.add
      local.get $0
      local.get $4
      block (result i32)
       local.get $6
       local.tee $21
       i32.const 1
       i32.add
       local.set $6
       local.get $21
      end
      i32.add
      call $~lib/string/String#charCodeAt
      i32.store16
     end
     br $continue|2
    end
   end
  end
  block $break|3
   loop $continue|3
    local.get $5
    i32.const 3
    i32.add
    i32.const 65535
    i32.and
    local.get $3
    i32.lt_u
    if
     block
      local.get $5
      local.set $7
      local.get $5
      i32.const 1
      i32.add
      local.set $8
      local.get $5
      i32.const 2
      i32.add
      local.set $9
      local.get $5
      i32.const 3
      i32.add
      local.set $10
      local.get $1
      local.get $4
      local.get $7
      i32.add
      call $~lib/string/String#charCodeAt
      local.set $14
      local.get $1
      local.get $4
      local.get $8
      i32.add
      call $~lib/string/String#charCodeAt
      local.set $15
      local.get $1
      local.get $4
      local.get $9
      i32.add
      call $~lib/string/String#charCodeAt
      local.set $16
      local.get $1
      local.get $4
      local.get $10
      i32.add
      call $~lib/string/String#charCodeAt
      local.set $17
      local.get $5
      i32.const 4
      i32.add
      local.set $5
      local.get $5
      local.set $11
      block $break|4
       i32.const 0
       local.set $6
       loop $repeat|4
        local.get $6
        local.get $18
        i32.lt_u
        i32.eqz
        br_if $break|4
        block
         local.get $19
         local.get $6
         i32.add
         i32.load16_u
         local.set $12
         local.get $19
         local.get $6
         i32.add
         i32.const 1
         i32.add
         i32.load16_u
         local.set $13
         local.get $12
         local.get $7
         local.get $8
         local.get $14
         local.get $13
         call $assembly/index/min
         local.set $7
         local.get $7
         local.get $8
         local.get $9
         local.get $15
         local.get $13
         call $assembly/index/min
         local.set $8
         local.get $8
         local.get $9
         local.get $10
         local.get $16
         local.get $13
         call $assembly/index/min
         local.set $9
         local.get $9
         local.get $10
         local.get $11
         local.get $17
         local.get $13
         call $assembly/index/min
         local.set $11
         local.get $19
         local.get $6
         i32.const 65535
         i32.and
         i32.add
         local.get $11
         i32.store16
         local.get $9
         local.set $10
         local.get $8
         local.set $9
         local.get $7
         local.set $8
         local.get $12
         local.set $7
        end
        local.get $6
        i32.const 2
        i32.add
        local.set $6
        br $repeat|4
        unreachable
       end
       unreachable
      end
     end
     br $continue|3
    end
   end
  end
  block $break|5
   loop $continue|5
    local.get $5
    local.get $3
    i32.lt_u
    if
     block
      local.get $1
      local.get $4
      local.get $5
      local.tee $7
      i32.add
      call $~lib/string/String#charCodeAt
      local.set $14
      local.get $5
      i32.const 1
      i32.add
      local.tee $5
      local.set $11
      block $break|6
       i32.const 0
       local.set $6
       loop $repeat|6
        local.get $6
        local.get $18
        i32.lt_u
        i32.eqz
        br_if $break|6
        block
         local.get $19
         local.get $6
         i32.const 65535
         i32.and
         i32.add
         i32.load16_u
         local.set $12
         local.get $12
         local.get $7
         i32.lt_u
         local.tee $21
         if (result i32)
          local.get $21
         else          
          local.get $11
          local.get $7
          i32.lt_u
         end
         if (result i32)
          local.get $12
          local.get $11
          i32.gt_u
          if (result i32)
           local.get $11
           i32.const 1
           i32.add
          else           
           local.get $12
           i32.const 1
           i32.add
          end
         else          
          local.get $14
          local.get $19
          local.get $6
          i32.const 1
          i32.add
          i32.const 65535
          i32.and
          i32.add
          i32.load16_u
          i32.eq
          if (result i32)
           local.get $7
          else           
           local.get $7
           i32.const 1
           i32.add
          end
         end
         local.set $11
         local.get $19
         local.get $6
         i32.const 65535
         i32.and
         i32.add
         local.get $11
         i32.store16
         local.get $12
         local.set $7
        end
        local.get $6
        i32.const 2
        i32.add
        local.set $6
        br $repeat|6
        unreachable
       end
       unreachable
      end
     end
     br $continue|5
    end
   end
  end
  block $~lib/memory/memory.free|inlined.0
   local.get $19
   local.set $21
   local.get $21
   call $~lib/allocator/arena/__memory_free
   br $~lib/memory/memory.free|inlined.0
  end
  local.get $11
 )
 (func $~lib/internal/memory/memcmp (; 8 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 0
   return
  end
  block $break|0
   loop $continue|0
    local.get $2
    i32.const 0
    i32.ne
    local.tee $3
    if (result i32)
     local.get $0
     i32.load8_u
     local.get $1
     i32.load8_u
     i32.eq
    else     
     local.get $3
    end
    if
     block
      local.get $2
      i32.const 1
      i32.sub
      local.set $2
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      local.get $1
      i32.const 1
      i32.add
      local.set $1
     end
     br $continue|0
    end
   end
  end
  local.get $2
  if (result i32)
   local.get $0
   i32.load8_u
   local.get $1
   i32.load8_u
   i32.sub
  else   
   i32.const 0
  end
 )
 (func $~lib/memory/memory.compare (; 9 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/internal/memory/memcmp
 )
 (func $~lib/memory/memory.allocate (; 10 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  call $~lib/allocator/arena/__memory_allocate
  return
 )
 (func $~lib/memory/memory.free (; 11 ;) (type $FUNCSIG$vi) (param $0 i32)
  local.get $0
  call $~lib/allocator/arena/__memory_free
  return
 )
 (func $~lib/allocator/arena/__memory_reset (; 12 ;) (type $FUNCSIG$v)
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $~lib/memory/memory.reset (; 13 ;) (type $FUNCSIG$v)
  call $~lib/allocator/arena/__memory_reset
  return
 )
 (func $start (; 14 ;) (type $FUNCSIG$v)
  call $start:assembly/index
 )
 (func $null (; 15 ;) (type $FUNCSIG$v)
 )
)
